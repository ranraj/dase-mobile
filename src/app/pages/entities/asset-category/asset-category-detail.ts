import { Component, OnInit } from '@angular/core';
import { AssetCategory } from './asset-category.model';
import { AssetCategoryService } from './asset-category.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-category-detail',
  templateUrl: 'asset-category-detail.html',
})
export class AssetCategoryDetailPage implements OnInit {
  assetCategory: AssetCategory = {};

  constructor(
    private navController: NavController,
    private assetCategoryService: AssetCategoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetCategory = response.data;
    });
  }

  open(item: AssetCategory) {
    this.navController.navigateForward('/tabs/entities/asset-category/' + item.id + '/edit');
  }

  async deleteModal(item: AssetCategory) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.assetCategoryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-category');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
