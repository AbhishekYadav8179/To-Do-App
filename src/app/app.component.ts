import { ChangeDetectorRef, Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { DatabaseService } from './services/database.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private database:DatabaseService,public navCtrl:NavController,private translate: TranslateService,
    public storage:StorageService,private cdr:ChangeDetectorRef) {
    console.log("hIiiiiii");
    //translate.use('en');
    console.log("BYeeeeee");

    this.initApp();
    console.log("Called");
    
  }

  async initApp(){
    await this.database.initializePlugin();
    console.log("INITAPP");
    SplashScreen.hide();

  }


  lang:string='';

  async ngOnInit(){
    // this.lang = await this.storage.get('language');
    //       console.log("LANGUAGE in app component ngOninit:",this.lang);
    //       this.translate.use(this.lang);
    // console.log("NgOnInit-appcomponent-gpk");
          this.cdr.detectChanges();
  }

  async languageChange(lang:string){
    // this.lang = await this.storage.get('language');
    //       console.log("LANGUAGE in app component ionViewDidEnter:",this.lang);
          this.translate.use(this.lang);
  }

  // async ionViewWillEnter(){
  //   this.lang = await this.storage.get('language');
  //         console.log("LANGUAGE in app component ionViewWillEnter:",this.lang);
  //         this.translate.setDefaultLang(this.lang);
  // }

  

  

  logout(){
    this.navCtrl.navigateRoot(['/signup']);
  }
  switchLanguage(language: string) {
    console.log("LANGUAGE",language);
    this.translate.use(language);
  }
  
}
