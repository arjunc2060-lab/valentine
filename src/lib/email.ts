// EmailJS type declaration
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (serviceId: string, templateId: string, templateParams: Record<string, string>) => Promise<unknown>;
    };
  }
}

// EmailJS configuration
const SERVICE_ID = "service_pv4iy1j";
const TEMPLATE_ID = "template_et1ycvx";

/**
 * Send email notification when user clicks YES or NO
 * @param answer - "YES 💖" or "NO 💔"
 */
export async function sendResponse(answer: string): Promise<void> {
  const templateParams = {
    choice: answer,
    time: new Date().toLocaleString(),
  };

  try {
    await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
