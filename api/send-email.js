// api/send-email.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { user_name, user_email, message } = req.body;

    const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY, 
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // ADD THIS LINE
        template_params: { user_name, user_email, message }
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.text();

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error("EmailJS Error details:", data);
            return res.status(500).json({ error: data });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
