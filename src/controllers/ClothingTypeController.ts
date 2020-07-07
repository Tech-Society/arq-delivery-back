import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import {ClothingType} from "../entity/ClothingType";

class ClothingTypeController {
    static listAll = async (req: Request, res: Response) => {
        //Get clothing types from database
        const clothingTypeRepository = getRepository(ClothingType);
        const clothingTypes = await clothingTypeRepository.find({
            select: [
               "clothing_type_id"
                , "description"
                , "status"
            ]
        });

        //Send the clothing types object
        res.status(200).send({
            success: true,
            data: clothingTypes
        });
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the clothing type from database
        const clothingTypeRepository = getRepository(ClothingType);
        let clothingType: ClothingType;

        try {
            clothingType = await clothingTypeRepository.findOneOrFail(id, {
                select: [
                    "clothing_type_id"
                    , "description"
                    , "status"
                ]
            });
        } catch (e) {
            res.status(404).send({
                success: false,
                message: "Tipo de ropa no encontrado"
            });
        }

        //Send the customer object
        res.status(200).send({
            success: true,
            data: clothingType
        });
    }

    static create = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { description } = req.body;

        console.log(description)
        let clothingType = new ClothingType();
        clothingType.description = description;

        //Validade if the parameters are ok
        const errors = await validate(clothingType);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to customer. If fails, exist
        const clothingTypeRepository = getRepository(ClothingType);
        try {
            await clothingTypeRepository.save(clothingType);
        } catch (e) {
            console.log(e);
            res.status(400).send({
                success: false,
                message: "No se pudo crear tipo de ropa"
            });
            return;
        }


        //If all ok, send 201 response
        res.status(201).send({
            success: true,
            message: "Tipo de ropa creado",
            id: await clothingTypeRepository.getId(clothingType)
        });
    }

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get parameters from the body
        let { description } = req.body;

        //Try to find customer on database
        const clothingTypeRepository = getRepository(ClothingType);
        let clothingType;
        try {
            clothingType = await clothingTypeRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({
                success: false,
                message: "Cliente no encontrado"
            });
            return;
        }

        //Validate the new values on model
        clothingType.description = description;

        const errors = await validate(clothingType);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                message: errors
            });
            return;
        }

        //Try to safe, if fails, that means email already in use
        try {
            await clothingTypeRepository.save(clothingType);
        } catch (e) {
            res.status(400).send({
                success: false,
                message: "No se pudo editar tipo de ropa"
            });
            return;
        }
        //If all ok, send 201 response
        res.status(200).send({
            success: true,
            message: "Tipo de ropa actualizado"
        });
    }

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const clothingTypeRepository = getRepository(ClothingType);
        let clothingType: ClothingType;
        try {
            clothingType = await clothingTypeRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({
                success: false,
                message: "Tipo de ropa no encontrado"
            });
            return;
        }
        await clothingTypeRepository.delete(id);


        //After all send a 200 response
        res.status(200).send({
            success: true,
            message: `Tipo de ropa con ${id} fue eliminado`
        });
    };
}

export default ClothingTypeController;