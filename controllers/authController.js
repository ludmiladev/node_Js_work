const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/modelsUsers.js');

dotenv.config();

//мідлвара
async function authorize(req, res, next) {

    const authorizationHeader = req.get('Authorization'); // дістаємо хедер з req, за допом. метода get і вказуєм ключ заголовку(хедера) "Authorization", з заголовка дістаєм токен
    if (!authorizationHeader) {
        // провірка якщо хедера нема
        return res.status(401).send({ message: 'Not authorized' });
    }
    const token = authorizationHeader.replace('Bearer ', ''); // розпаршуєм токен (викидаєм з токена зайве слово bearer-яке йде позамовчуванню)
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET); // метод verify провіряє чи валідний токен
        const { userId } = payload; //з payload через диструктуризац. взяли userId
        const user = await User.findById(userId); // провіряєм чи user є в БД

        if (!user) {
            // провірка якщо користувача нема
            return res.status(401).send({ message: 'Not authorized' });
        }
        req.user = user; // записали знайденого user в req
        next();
    } catch (error) {
        return res.status(401).send(error);
    }
}
module.exports = { authorize };