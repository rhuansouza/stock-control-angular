import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = []

  constructor(private productsService: ProductsService,
    private productsDtService:ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
    ){

  }

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas() {
    //chama produtos que estão em memória
    const productsLoaded = this.productsDtService.getProductsDatas();

    if(productsLoaded.length > 0 ){
      this.productsDatas = productsLoaded
      console.log('dados de produtos memoria da API ',this.productsDatas);
    }else{
      this.getAPIProductsDatas();

    }
  }

  getAPIProductsDatas() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next:(response) => {
        if(response.length > 0){
          this.productsDatas = response
          console.log('dados de produtos da API ',this.productsDatas)
        }
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos',
          life: 2500,
        })
        this.router.navigate(['/dashboard']);

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleProductAction(event: EventAction):void{
    if(event){
      this.ref = this.dialogService.open(ProductFormComponent,{
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.productsDatas,
        },
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIProductsDatas(),
      });
    }
  }

  handleDeleteProductAction(event: { product_id: string, productName: string}):void{
    if (event){
      console.log('Dados recebidos do evento de deletar o produto', event);
      this.confirmationService.confirm({
      message: `Confirma a exclusão do produto: ${event?.productName}?`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deleteProduct(event?.product_id),

      })
    }
  }


  deleteProduct(product_id: string) {
    if(product_id){
      this.productsService.deleteProduct(product_id)
      .pipe(
        takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response){
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail:'Produto removido com sucesso!',
                life: 2500,
              });

              this.getAPIProductsDatas();
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail:'Erro ao remover produto!',
              life: 2500,
            });
          }
        })
    }
  }

}
