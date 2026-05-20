"use client";

import type { Proposta, PropostaItem } from "../../../src/types";

export interface PropostaComItens extends Proposta {
  itens: PropostaItem[];
}

function formatarData(dataIso: string | undefined) {
  if (!dataIso) return "";
  try {
    return new Date(dataIso).toLocaleDateString("pt-BR");
  } catch {
    return dataIso;
  }
}

function sanitizeText(text: string | undefined | null) {
  if (!text) return "";
  return String(text)
    .normalize("NFC")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "")
    .trim();
}

export async function gerarPdfPropostaSimples(proposta: PropostaComItens) {
  const { default: JsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new JsPDF("p", "pt", "a4");
  const marginLeft = 40;
  const marginRight = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - marginLeft - marginRight;
  let y = 40;

  // --- HEADER ---
  try {
    // Usando o novo logo da pasta assets
    doc.addImage("/assets/filmelab-logo.png", "PNG", marginLeft, y, 120, 30);
  } catch (e) {
    console.warn("Logo não encontrado em /assets/filmelab-logo.png");
    try {
      doc.addImage("/images/logos/filmelab.png", "PNG", marginLeft, y, 120, 30);
    } catch (e2) {}
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const dataCriacao = formatarData(proposta.criadoEm);
  doc.text(`Enviado em: ${dataCriacao}`, pageWidth - marginRight, y + 15, {
    align: "right",
  });

  y += 70; // Aumentado para dar mais espaçamento

  // --- TÍTULO DA PROPOSTA ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const tituloFull =
    `${proposta.numero ?? ""} ${proposta.empresa?.nome ?? ""} - ${proposta.titulo}`.trim();
  const tituloLines = doc.splitTextToSize(tituloFull, usableWidth);
  doc.text(tituloLines, pageWidth / 2, y, { align: "center" });
  y += tituloLines.length * 20 + 20;

  // --- SEÇÃO DE / PARA ---
  const colWidth = usableWidth / 2;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("De:", marginLeft, y);
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text(proposta.marca?.name || "Filmelab", marginLeft, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const deInfo = doc.splitTextToSize(
    "CREATIVE EDUCATIONAL STUDIO FILM&LAB LTDA EPP",
    colWidth - 20,
  );
  doc.text(deInfo, marginLeft, y);

  const yPara = y - 27;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Para:", marginLeft + colWidth, yPara);
  doc.setFont("helvetica", "bold");
  doc.text(proposta.contato?.nome || "", marginLeft + colWidth, yPara + 15);
  doc.setFont("helvetica", "normal");
  doc.text(proposta.empresa?.nome || "", marginLeft + colWidth, yPara + 27);

  y += Math.max(deInfo.length * 10, 30) + 30;

  if (proposta.introducao) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    const introLines = doc.splitTextToSize(proposta.introducao, usableWidth);
    doc.text(introLines, marginLeft, y);
    y += introLines.length * 12 + 20;
  }

  // --- TABELA DE ITENS ---
  autoTable(doc, {
    startY: y,
    head: [["Nome / Descrição", "Valor Unitário", "Qtd", "Subtotal"]],
    body: (proposta.itens || []).map((item) => {
      const nome = sanitizeText(item.nome);
      const desc = sanitizeText(item.descricao);
      const inclui = sanitizeText(item.inclui);
      const naoInclui = sanitizeText(item.naoInclui);

      let nomeDesc = `${nome}`;
      if (desc) nomeDesc += `\n \nDESCRIÇÃO\n${desc}`;
      if (inclui) nomeDesc += `\n \nCONTEMPLA\n${inclui}`;
      if (naoInclui) nomeDesc += `\n \nNÃO CONTEMPLA\n${naoInclui}`;

      const temDesconto = item.valorDesconto && item.valorDesconto > 0;
      const valorUnitarioTotal =
        Number(item.precoUnitario) * Number(item.quantidade);

      let subtotalTexto = "";
      if (temDesconto) {
        const descInfo =
          item.tipoDesconto === "percentual"
            ? `(-${item.valorDesconto}%)`
            : `(-${Number(item.valorDesconto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`;

        subtotalTexto = `${valorUnitarioTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ${descInfo}\n${Number(item.precoTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
      } else {
        subtotalTexto = Number(item.precoTotal).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      return [
        nomeDesc,
        Number(item.precoUnitario).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        item.quantidade,
        subtotalTexto,
      ];
    }),
    theme: "grid",
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 8,
      valign: "top",
      lineColor: [0, 0, 0], // Mudado para preto
      lineWidth: 0.5,
      textColor: [0, 0, 0], // Garante que o texto seja preto
    },

    columnStyles: {
      0: { cellWidth: 280 },
      1: { cellWidth: 80, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 100, halign: "right" },
    },
    didDrawCell: (data) => {
      if (data.column.index === 3 && data.cell.section === "body") {
        const item = (proposta.itens || [])[data.row.index];
        if (item && item.valorDesconto && item.valorDesconto > 0) {
          const textLines = data.cell.text;
          if (textLines.length > 1) {
            const firstLine = textLines[0];
            const textWidth = doc.getTextWidth(firstLine);
            const x =
              data.cell.x +
              data.cell.width -
              data.cell.padding("right") -
              textWidth;
            const yLine =
              data.cell.y + data.cell.padding("top") + doc.getFontSize() * 0.6;

            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(x, yLine, x + textWidth, yLine);
          }
        }
      }
    },
  });

  const lastTable = (doc as any).lastAutoTable;
  y = lastTable.finalY + 20;

  // Verifica se os totais cabem na página, senão pula
  if (y + 120 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    y = 40;
  }

  // --- TOTAIS ---
  const totalBoxWidth = 220;
  const totalLabelX = pageWidth - marginRight - totalBoxWidth + 10;
  const totalValueX = pageWidth - marginRight - 10;

  // Calcula o valor original total (sem nenhum desconto)
  const valorOriginalGlobal = (proposta.itens || []).reduce(
    (acc, i) => acc + Number(i.precoUnitario) * Number(i.quantidade),
    0,
  );
  const valorFinalGlobal = Number(proposta.valorTotal);
  const totalDesconto = valorOriginalGlobal - valorFinalGlobal;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Subtotal (Sempre mostra o valor cheio original)
  doc.text("Subtotal", totalLabelX, y);
  const subtotalValueTexto = valorOriginalGlobal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  doc.text(subtotalValueTexto, totalValueX, y, { align: "right" });

  // Se houver qualquer desconto (global ou nos itens), risca o subtotal
  if (totalDesconto > 0.01) {
    const textWidth = doc.getTextWidth(subtotalValueTexto);
    const xLine = totalValueX - textWidth;
    const yLine = y - 3;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(xLine, yLine, totalValueX, yLine);

    y += 18;

    // Linha de Desconto
    let descLabel = "Desconto";
    if (
      proposta.tipoDescontoGlobal === "percentual" &&
      proposta.valorDescontoGlobal
    ) {
      descLabel = `Desconto (${proposta.valorDescontoGlobal}%)`;
    }

    doc.text(descLabel, totalLabelX, y);
    doc.text(
      `- ${totalDesconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      totalValueX,
      y,
      { align: "right" },
    );
  }

  y += 22;

  // Total Final
  doc.setFillColor(235, 235, 235);
  doc.rect(
    pageWidth - marginRight - totalBoxWidth,
    y - 14,
    totalBoxWidth,
    26,
    "F",
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total", totalLabelX, y + 4);
  doc.text(
    valorFinalGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    totalValueX,
    y + 4,
    { align: "right" },
  );

  y += 50;

  // --- BANNER FINAL ---
  if (y + 220 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    y = 40;
  }

  try {
    // Usando o novo banner da pasta assets
    doc.addImage(
      "/assets/bannersemnome.png",
      "PNG",
      marginLeft,
      y,
      usableWidth,
      220,
    );
  } catch (e) {
    console.warn("Banner não encontrado em /assets/bannersemnome.png");
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(marginLeft, y, usableWidth, 120, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Vamos criar juntos?", marginLeft + 20, y + 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Fale com a gente: ozz@filmelab.com.br | @filmelab | www.filmelab.com.br",
      marginLeft + 20,
      y + 100,
    );
  }

  doc.save(
    `proposta-${proposta.numero || "kaoskampf"}-${proposta.empresa?.nome || "cliente"}.pdf`,
  );
}
