import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

// >>> COLOQUE AQUI <<<
// Esta linha diz ao Node para servir o index.html e os ficheiros da pasta atual
app.use(express.static('.'));

// Configure as suas credenciais do Mercado Pago no ficheiro .env
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

app.post('/create-preference', async (req, res) => {
    const { title, price } = req.body;

    try {
        const preference = new Preference(client);
        
        const response = await preference.create({
            body: {
                items: [
                    {
                        title: title,
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'BRL'
                    }
                ],
                back_urls: {
                    success: "https://seusite.com/sucesso",
                    failure: "https://seusite.com/falha",
                    pending: "https://seusite.com/pendente"
                },
                auto_return: "approved",
            }
        });

        res.json({ init_point: response.init_point });

    } catch (error) {
        console.error("Erro ao criar preferência:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));