import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Customer} from '../entity/Customer';
import {validate} from "class-validator";

class CustomerController {
    static listAll = async (req: Request, res: Response) => {
        //Get customers from database
        const customerRepository = getRepository(Customer);
        const customers = await customerRepository.find({
            select: [
               "customer_id"
                , "name"
                , "full_name"
                , "phone"
                , "email"
                , "status"
            ]
        });

        //Send the customers object
        res.status(200).send({
            success: true,
            data: customers
        });
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the customer from database
        const customerRepository = getRepository(Customer);
        let customer: Customer;

        try {
            customer = await customerRepository.findOneOrFail(id, {
                select: [
                    "customer_id"
                    , "name"
                    , "full_name"
                    , "phone"
                    , "email"
                    , "status"
                ]
            });
        } catch (e) {
            res.status(404).send({
                success: false,
                message: "Cliente no encontrado"
            });
        }

        //Send the customer object
        res.status(200).send({
            success: true,
            data: customer
        });
    }

    static create = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, full_name, address, phone, email } = req.body;

        let customer = new Customer();
        customer.name = name;
        customer.full_name = full_name;
        customer.address = address;
        customer.phone = phone;
        customer.email = email;

        //Validade if the parameters are ok
        const errors = await validate(customer);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to customer. If fails, exist
        const customerRepository = getRepository(Customer);
        try {
            await customerRepository.save(customer);
        } catch (e) {
            console.log(e);
            res.status(400).send({
                success: false,
                message: "No se pudo crear cliente"
            });
            return;
        }


        //If all ok, send 201 response
        res.status(201).send({
            success: true,
            message: "cliente creado",
            id: await customerRepository.getId(customer)
        });
    }

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get parameters from the body
        let { name, full_name, address, phone, email } = req.body;

        //Try to find customer on database
        const customerRepository = getRepository(Customer);
        let customer;
        try {
            customer = await customerRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({
                success: false,
                message: "Cliente no encontrado"
            });
            return;
        }

        //Validate the new values on model
        customer.name = name;
        customer.full_name = full_name;
        customer.address = address;
        customer.phone = phone;
        customer.email = email;

        const errors = await validate(customer);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to safe, if fails, that means email already in use
        try {
            await customerRepository.save(customer);
        } catch (e) {
            res.status(400).send({
                success: false,
                message: "No se pudo editar cliente"
            });
            return;
        }
        //If all ok, send 201 response
        res.status(200).send({
            success: true,
            message: "Cliente Actualizado"
        });
    }

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const customerRepository = getRepository(Customer);
        let customer: Customer;
        try {
            customer = await customerRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({
                success: false,
                message: "Banco no encontrado"
            });
            return;
        }
        await customerRepository.delete(id);


        //After all send a 200 response
        res.status(200).send({
            success: true,
            message: `Cliente con ${id} fue eliminado`
        });
    };
}

export default CustomerController;