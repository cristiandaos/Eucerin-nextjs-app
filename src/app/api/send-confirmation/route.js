import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, name, items, total } = await req.json();

    const response = await resend.emails.send({
      from: "Eucerin <onboarding@resend.dev>",
      to: email,
      subject: "Confirmación de Compra - Eucerin",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
          <h2>¡Hola ${name || "cliente"}! 🎉</h2>
          <p>Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; border: 1px solid #ccc;">Cantidad</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Producto</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Precio Unitario</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
                      <td style="padding: 8px; border: 1px solid #ccc;">${item.name}</td>
                      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">S/. ${item.price.toFixed(2)}</td>
                      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">S/. ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; background-color: #f9f9f9;">
                <td colspan="3" style="padding: 10px; border: 1px solid #ccc; text-align: right;">Total</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">S/. ${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin-top: 20px;">Recibirás tus productos pronto. ¡Gracias por confiar en nosotros!</p>
          <p>Atentamente,<br/>Equipo de Eucerin</p>
        </div>
      `,
    });

    return Response.json({ status: "ok", id: response.id });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el correo." }),
      { status: 500 }
    );
  }
}
