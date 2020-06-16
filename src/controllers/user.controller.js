import dotenv from 'dotenv'
dotenv.config()
import generator from 'generate-password';

const db = require('../sequelize/models');
const helpers = require("../lib/helpers");
const email = require("../lib/sende-email");
const jwt = require('jsonwebtoken')



export async function getUsers(req, res) {
    const roleId = req.tokenData.role
    try {
        const users = await db.sequelize.query("CALL getUsuarios(:roleId)", {
            replacements: { roleId }
        });
        return res.status(200).json({ status: true, data: users })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error })
    }
}

export async function profile(req, res) {
    const id = req.params.id
    try {
        const profile = await db.sequelize.query("CALL getUsuarioId (:id)", {
            replacements: { id: id }
        });
        res.status(200).json({ status: true, data: profile })

    } catch (error) { res.status(500).json({ status: false, message: error }) }
}

export async function updateUser(req, res) {
    const headersR = req.headers.ages;
    const data = await helpers.decode(headersR)
    if (!data.first_name || !data.last_name ||
        !data.email || !data.user_name ||
        !data.roleId || !data.user_end) {
        return res.status(404).json({ status: false, message: 'insert all the fields' });
    } else {
        const { id } = req.params
        const {
            first_name,
            last_name,
            type_document,
            num_document,
            people_address,
            phone,
            email,
            user_name,
            state,
            user_end,
            roleId
        } = data
        const updatePeople = { first_name, last_name, type_document, num_document, people_address, phone, email, state }
        const updateUser = { user_name, state, user_end, roleId }

        try {
            const response = await db.sequelize.transaction(async() => {
                const user = await db.Client_people_user.findOne({
                    attributes: ['clientId', 'userPersonId', 'userId'],
                    where: { userId: id, }
                })
                if (!user) return res.status(304).json({ status: false, message: "not user registered" })
                const peopleResult = await db.People.update(updatePeople, {
                    fields: ['first_name', 'last_name', 'email', 'state', ],
                    where: { id: user.userPersonId }
                })
                const userUpdate = await db.User.update(updateUser, {
                    fields: ['user_name', 'state', 'user_end', 'roleId'],
                    where: { id: user.userId }
                })
                if (!userUpdate) return res.status(304).json({ status: false, message: "error update user" })
                return res.status(200).json({ status: true, message: 'update successfully' })
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, message: error })
        }
    }
}

export async function updateUserState(req, res) {
    try {
        const { id } = req.params

        const userUpdate = await db.sequelize.query("SELECT state FROM users WHERE id = :id", { replacements: { id: id } })
        if (!userUpdate) return res.status(404).json({ status: false, message: "error update user" })
        const array = userUpdate[0],
            state = array[0].state

        if (state === 1) {
            await db.User.update({ state: 0 }, { where: { id } })
            return res.status(200).json({ status: true, message: 'Disabled user', data: state })
        } else {
            await db.User.update({ state: 1 }, { where: { id } })
            return res.status(200).json({ status: true, message: 'Enabled user', data: state })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error })
    }
}

export async function updatePassword(req, res) {
    try {
        const headersR = req.headers.ages;
        const data = await helpers.decode(headersR)
        if (!data.password || data.password.length > 5 ) {
            return res.status(404).json({ status: false, message: 'insert all the fields' });
        } else {
            const { password } = data
            const id = req.params.id
            const hashs = await helpers.encryptPassword(password);
            const update = await db.User.update({ password: hashs, }, { where: { id } })
            if (!update) return res.status(404).json({ status: false, message: 'error update password' });
            return res.status(200).json({ status: true, message: 'update password successfully' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error })
    }

}

export async function generatePassword(req, res) {
    try {
        const id = req.params.id,
            generate = generator.generate({ length: 8, numbers: true }),
            hashs = await helpers.encryptPassword(generate);

        const update = await db.User.update({ password: hashs, }, { where: { id } })
        if (update) {
            const result = await db.sequelize.query("CALL getUsuarioId (:id)", { replacements: { id: id } })
            const user = result[0]

            const subject = `Restablece tu contraseña ${user.first_name} ${user.last_name}`
            const message = `para cambiar su contraseña ingresa al sistema con la siguiente clave: ${generate}`
            const html = `
                <div style="margin: 10px;">
                    <p><strong>Escuchamos que perdió su clave. ¡Lo sentimos por eso!</strong></p>
                    <div style="width: 75vh;height:50px">
                        <p>Pero no te preocupes! Puedes ingrese al sistema para restablecerla, con el mismo <strong>USUARIO</strong> y con la siguiente clave.</p>
                    </div>                
                    <div style="width: 50vh;height:35px;padding-left: 10;">
                        <p><strong>Clave:  </strong>${generate}</p>
                    </div>                
                    <p style="padding-bottom: 16px;">La clave no es segura le sugerimos cambiar lo más pronto posible.</p>
                    Gracias,
                    <div style="width: 38vh;height:50px">                
                        <strong> El equipo de Alac Outdoor </strong>
                        <img src="${process.env.MAIL_URL_IMAGE}" alt="Alac">
                    </div>
                </div>        
                
                `
            const response = await email.sendEmail(user.email, subject, message, html)
            if (!response) return res.status(404).json({ status: false, message: 'error in sending in the mail' });
            return res.status(200).json({ status: true, message: 'update password successfully', response })
        } else return res.status(404).json({ status: false, message: 'error update password' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error })
    }


}

export async function searchUser(req, res) {
    const { valor } = req.params
    const Op = Sequelize.Op;

    if (!isNaN(valor)) {
        try {
            const searchName = await db.People.findAll({
                attributes: ['id', 'first_name', 'last_name', 'type_document', 'num_document', 'num_document',
                    'people_address', 'phone', 'email'
                ],
                where: {
                    num_document: {
                        [Op.like]: `%${valor}`,
                    },
                }
            }, {
                offset: 10,
                limit: 2
            })
            return res.status(200).json({ status: true, data: searchName })
        } catch (error) { res.status(500).json({ status: false, message: error }) }
    } else {
        try {
            const searchName = await db.People.findAll({
                attributes: ['id', 'first_name', 'last_name', 'type_document', 'num_document', 'num_document',
                    'people_address', 'phone', 'email'
                ],
                where: {
                    first_name: {
                        [Op.like]: `%${valor}%`,
                    },
                }
            }, {
                offset: 10,
                limit: 2
            })
            return res.status(200).json({ status: true, data: searchName })
        } catch (error) { res.status(500).json({ status: false, message: error }) }
    }
}