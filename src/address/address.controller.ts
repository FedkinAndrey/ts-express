import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import Address from './address.entity';
import ormconfig from "../ormconfig";

class AddressController implements Controller {
  public path = '/addresses';
  public router = express.Router();
  private addressRepository = ormconfig.getRepository(Address);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllAddresses);
  }

  private getAllAddresses = async (request: express.Request, response: express.Response) => {
    const addresses = await this.addressRepository.find();
    response.send(addresses);
  }
}

export default AddressController;