import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import 'dotenv/config';

const app = express();

// Configurações Globais / Middlewares
app.use(express.json());
app.use(cors());

// Serve o index.html e os ficheiros da pasta atual no ambiente local ou de produção
app.use(express.static('.'));

// Configure as suas credenciais do Mercado Pago no painel do Render ou ficheiro .env
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

// ==========================================
// [FUTURO] ESTRUTURA PARA CADASTRO E LOGIN
// ==========================================

// Rota de Cadastro (Exemplo inicial de estrutura)
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Aqui entrará a lógica de criptografia (bcrypt) e salvamento no Banco de Dados
        console.log(`Tentativa de registro para: ${email}`);
        res.status(201).json({ message: "Estrutura de cadastro pronta! Banco de dados pendente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota de Login (Exemplo inicial de estrutura)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Aqui entrará a validação de senha e a geração do token JWT
        console.log(`Tentativa de login para: ${email}`);
        res.json({ message: "Estrutura de login pronta! Token JWT pendente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ROTA INTEGRADA DO MERCADO PAGO
// ==========================================
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

// Inicialização Dinâmica do Servidor (Obrigatório para o Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
