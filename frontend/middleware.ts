import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que NÃO precisam de autenticação (públicas)
const publicPaths = ["/", "/login", "/cadastro"];

// Verifica se é uma rota de visualização de proposta (pública)
function isPropostaVisualizacaoRoute(pathname: string): boolean {
  // Aceita /propostas/{hash}/visualizar com ou sem / final
  return /^\/propostas\/[^/]+\/visualizar\/?$/.test(pathname);
}

// Rotas que PRECISAM de autenticação
const protectedPaths = [
  "/atividades",

  "/contatos",
  "/projetos",
  "/propostas", // Listagem/gerenciamento de propostas (exceto visualização)
  "/empresas",
  "/perfil",
  "/colaboradores",
  "/usuarios",
  "/timeline",
  "/admin",
  "/notas",
  "/catalogo",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verificar se é uma rota de visualização de proposta (pública)
  if (isPropostaVisualizacaoRoute(pathname)) {
    console.log(`✅ [middleware] Rota de visualização pública: ${pathname}`);
    return NextResponse.next();
  }

  // 2. Verificar se é outra rota pública
  const isPublic =
    publicPaths.includes(pathname) || pathname.startsWith("/cadastro");

  if (isPublic) {
    console.log(`✅ [middleware] Rota pública: ${pathname}`);
    return NextResponse.next();
  }

  // 3. Verificar se é uma rota protegida
  const needsAuth = protectedPaths.some((route) => pathname.startsWith(route));

  if (!needsAuth) {
    // Rota não listada como protegida - permitir
    console.log(`ℹ️ [middleware] Rota não protegida: ${pathname}`);
    return NextResponse.next();
  }

  // 4. Verificar autenticação para rotas protegidas
  const token = request.cookies.get("kaoskampf-auth")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedValue = decodeURIComponent(token);
      const authData = JSON.parse(decodedValue);
      isAuthenticated = !!authData.token;
    } catch (e) {
      console.warn("⚠️ [middleware] Falha ao parsear cookie kaoskampf-auth", e);
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    console.log(
      `🔒 [middleware] Acesso negado para: ${pathname} - redirecionando para /login`,
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Redirecionar usuário autenticado que tenta acessar /login
  if (pathname === "/login" && isAuthenticated) {
    console.log(
      `↩️ [middleware] Usuário autenticado redirecionado de /login para /painel`,
    );
    return NextResponse.redirect(new URL("/atividades", request.url));
  }

  console.log(`✅ [middleware] Acesso autorizado: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
