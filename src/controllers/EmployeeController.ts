import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Employee} from "../entity/Employee";
import {validate} from "class-validator";

class EmployeeController {
    static listAll = async (req: Request, res: Response) => {
        //Get employees from database
        const employeeRepository = getRepository(Employee);
        const employees = await employeeRepository.find({
            select: [
               "employee_id"
                , "name"
                , "full_name"
                , "phone"
                , "address"
                , "status"
            ]
        });

        //Send the employees object
        res.status(200).send({
            success: true,
            data: employees
        });
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the employee from database
        const employeeRepository = getRepository(Employee);
        let customer: Employee;

        try {
            customer = await employeeRepository.findOneOrFail(id, {
                select: [
                    "employee_id"
                    , "name"
                    , "full_name"
                    , "phone"
                    , "address"
                    , "status"
                ]
            });
        } catch (e) {
            res.status(404).send({
                success: false,
                message: "Empleado no encontrado"
            });
        }

        //Send the employee object
        res.status(200).send({
            success: true,
            data: customer
        });
    }

    static create = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, full_name, address, phone } = req.body;

        let employee = new Employee();
        employee.name = name;
        employee.full_name = full_name;
        employee.address = address;
        employee.phone = phone;

        //Validate if the parameters are ok
        const errors = await validate(employee);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to bank. If fails, exist
        const employeeRepository = getRepository(Employee);
        try {
            await employeeRepository.save(employee);
        } catch (e) {
            console.log(e);
            res.status(400).send({
                success: false,
                message: "No se pudo crear empleado"
            });
            return;
        }


        //If all ok, send 201 response
        res.status(201).send({
            success: true,
            message: "empleado creado",
            id: await employeeRepository.getId(employee)
        });
    }

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get parameters from the body
        let { name, full_name, address, phone } = req.body;

        //Try to find user on database
        const employeeRepository = getRepository(Employee);
        let employee;
        try {
            employee = await employeeRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({
                success: false,
                message: "Empleado no encontrado"
            });
            return;
        }

        //Validate the new values on model
        employee.name = name;
        employee.full_name = full_name;
        employee.address = address;
        employee.phone = phone;

        const errors = await validate(employee);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to safe, if fails, that means email already in use
        try {
            await employeeRepository.save(employee);
        } catch (e) {
            res.status(400).send({
                success: false,
                message: "No se pudo editar empleado"
            });
            return;
        }
        //If all ok, send 201 response
        res.status(200).send({
            success: true,
            message: "Empleado Actualizado"
        });
    }

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const employeeRepository = getRepository(Employee);
        let employee: Employee;
        try {
            employee = await employeeRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({
                success: false,
                message: "Empleado no encontrado"
            });
            return;
        }
        await employeeRepository.delete(id);


        //After all send a 200 response
        res.status(200).send({
            success: true,
            message: `Empleado con ${id} fue eliminado`
        });
    };
}

export default EmployeeController;