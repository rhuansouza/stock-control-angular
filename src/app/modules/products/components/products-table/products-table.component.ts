import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {
  //recebendo dados de cum componente pai
  @Input()
  products: Array<GetAllProductsResponse> = []
  @Output()
  productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  //metodo que vai emitir o evento que quer receber
  handleProductEvent(action: string, id?: string):void{
    if(action && action !== ''){
      const productEventData = id && id !== '' ? { action, id}: {action}
      //Emitir o valor do evento
      this.productEvent.emit(productEventData);

    }
  }

  handleDeleteProduct(product_id: string, productName: string): void{
    if(product_id != '' && productName != ''){
      this.deleteProductEvent.emit({
        product_id,
        productName,
      })
    }
  }

}