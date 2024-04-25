import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const app = express();

// Utilisation des middleware
app.use(cors());
app.use(express.json());

dotenv.config();

// Connexion à la base de données MariaDB avec un pool de connexions
const pool = mysql.createPool(process.env.DATABASE_URL);

// Définition des routes et des endpoints Express

app.get('/', async (req, res) => {
  res.send("hhelloo from online")
});

app.get('/test', async (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs : ' + error);
      res.status(500).send('Internal server error');
    } else {
      res.send(results);
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, nickname, password } = req.body;

  if (!email || !password || !nickname)
    return res.status(400).send({ error: 'Invalid request' });

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    pool.query(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
      [email, encryptedPassword, nickname],
      (error, results) => {
        if (error) {
          console.error('Erreur lors de l\'inscription de l\'utilisateur : ' + error);
          res.status(500).send('Internal server error');
        } else {
          res.send({ info: 'User successfully created' });
        }
      }
    );
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe : ' + err);
    res.status(500).send('Internal server error');
  }
});

// Les autres endpoints seront également modifiés de la même manière

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
