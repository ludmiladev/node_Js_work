const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../models/modelsUsers.js');
dotenv.config();
mongoose.set('useFindAndModify', false);
class UserController {
    async registerNewUser(req, res) {
        try {
            const { body } = req;
            const hashedPassword = await bcrypt.hash(body.password, 14);
            const createUser = await User.create({
                ...body,
                password: hashedPassword,
                token: '',
            });
            const { email, subscription } = createUser;
            res.status(201).json({
                user: { email: email, subscription: subscription },
            });
        } catch (error) {
            res.status(409).send('Email in use');
        }
    }

    validateUser(req, res, next) {
        const validUsers = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            subscription: Joi.string().default('free'),
        });
        const validationResult = validUsers.validate(req.body);
        if (validationResult.error) {
            return res.status(400).send(validationResult.error.message);
        }
        next();
    }

    async login(req, res) {
        const {
            body: { email, password },
        } = req;
        //провірка валідності email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('Email or password is wrong ');
        }
        //провірка валідності паролю
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Email or password is wrong ');
        }
        // Генераці токена
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET, // секретний ключ який іде 2 параметром
        );

        const userUpdate = await User.findByIdAndUpdate(user._id, { token: token }); // записуєм токен  в User в БД

        // return res.json({ token }); // віддаєм згенерований токен на клієнт
        return res.status(200).json({
            token: token,
            user: { email: email, subscription: user.subscription },
        });
    }
    authUser(req, res) {
        return res.status(200).json(req.user);
    }

    async logout(req, res) {
        const {
            params: { userId },
        } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send('Not authorized');
        }
        const tokenDelete = await User.findOneAndUpdate(userId, { token: '' });
        return res.status(204).send('No Content');
    }


    async getCurrentUser(req, res) {
        const { email, subscription } = req.user;
        return res.status(200).json({ email: email, subscription: subscription });
    }
}

module.exports = new UserController();