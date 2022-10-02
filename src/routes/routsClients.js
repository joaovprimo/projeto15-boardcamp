import express from "express";
import { postCustomers, getCustomers, getCustomersID, putCustomersID } from "../controllers/clientControllers.js";
import {checkPostClient, checkGetClients, checkGetClientsID, checkUpdateClientsID} from '../Middlewares/clientsMiddleware.js';

const router = express.Router();

router.post("/customers",checkPostClient,postCustomers);
router.get('/customers', checkGetClients, getCustomers);
router.get('/customers/:id_customer', checkGetClientsID, getCustomersID);
router.put('/customers/:id_customer', checkUpdateClientsID, putCustomersID);

export default router;