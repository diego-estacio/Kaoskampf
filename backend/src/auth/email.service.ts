import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/login/redefinir-senha?token=${token}`;

    try {
      await this.resend.emails.send({
        from: 'Hubee <onboarding@resend.dev>', // No início usar o e-mail padrão do Resend para domínios não verificados
        to: email,
        subject: 'Recuperação de Senha - Hubee',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h1 style="color: #667eea; text-align: center;">Hubee</h1>
            <p>Olá,</p>
            <p>Você solicitou a recuperação de senha da sua conta no Hubee. Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Redefinir Minha Senha
              </a>
            </div>
            <p style="font-size: 0.875rem; color: #64748b;">Este link é válido por 1 hora. Se você não solicitou esta alteração, ignore este e-mail.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 0.75rem; color: #94a3b8; text-align: center;">Hubee - Creative Educational Studio</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar e-mail de recuperação.');
    }
  }
}
