import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public productList: Array<GetAllProductsResponse> = [];

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDTService:ProductsDataTransferService
  ){}

  ngOnInit(): void {
    this.getProductsDatas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProductsDatas() {
    this.productsService.getAllProducts()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        if(response.length > 0 ){
          console.log('Produtos do banco de dados ',response)
          this.productList = response;
          this.productsDTService.setProductsDatas(this.productList);
          this.setProductsChartConfig();

        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail: 'Erro ao buscar produtos!',
          life:2500,
        })
      }
    })
  }

  setProductsChartConfig():void{
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surfaceBorder');

    this.productsChartDatas = {
      labels: this.productList.map((element) => element?.name),
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productList.map((element) => element?.amount),
        }
      ]
    }
    this.productsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: '500',
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

  }
}
