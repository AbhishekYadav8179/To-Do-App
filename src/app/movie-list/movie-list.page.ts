import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../services/storage.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
})
export class MovieListPage implements OnInit {

  constructor(public http:HttpClient,private translate:TranslateService,public storage:StorageService,
    private actionSheetCtrl:ActionSheetController) { }

  data:any=[];

  lang:string='';
  async ngOnInit(){

    this.lang = await this.storage.get('language');
    console.log("LANGUAGE:",this.lang);
    this.translate.setDefaultLang(this.lang);
    this.getData();
  }

  async presentLanguageActionSheet() {
    const headerKey='ACTIONSHEET.changeLanguage';
      const header=this.translate.instant(headerKey);
      const englishKey='ACTIONSHEET.english';
      const english=this.translate.instant(englishKey);

      const spanishKey='ACTIONSHEET.spanish';
      const spanish=this.translate.instant(spanishKey);

      const cancel=this.translate.instant('ACTIONSHEET.cancel');
      const ok=this.translate.instant('ALERT.ok');
    const actionSheet = await this.actionSheetCtrl.create({
      header: header,
      buttons: [
        {
          text: english,
          handler: () => {
            this.changeLanguage('en');
          }
        },
        {
          text: spanish,
          handler: () => {
            this.changeLanguage('es');
          }
        },
        {
          text: cancel,
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async changeLanguage(lang:string){
    this.translate.use(lang);
    this.storage.set('language',lang);
    
  }


  getData(){
    this.http.get<any>('https://reactnative.dev/movies.json').subscribe(data=>{
      console.log("Data: ",data);
      this.data=data;
    },error=>{
      console.log("Error: ",error);
    });
  }

}
