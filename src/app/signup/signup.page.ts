import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import * as enMessages from '../../assets/i18n/en.json';
import * as esMessages from '../../assets/i18n/es.json';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
navHome() {
  this.router.navigate(['/home']);
}
navHome1() {
  this.router.navigate(['/home1']);
}

  currentLanguage='en';
  showSignup=false;
  users=this.database.getUsers();
  name='';
  email='';
  phoneNumber='';
  password='';

  @ViewChild('loginForm')
  loginForm!: NgForm;

  @ViewChild('signupForm')
  signupForm!: NgForm;

  constructor(public database:DatabaseService,public router:Router,private toastController:ToastController,
    public navCtrl:NavController,private languageService:LanguageService,private translate:TranslateService,
    private actionSheetController:ActionSheetController,private http:HttpClient,public storage:StorageService,
    private zone:NgZone, private appComponent:AppComponent) {
      this.translate.setDefaultLang('en');
      this.storage.set('language','en');
      //languageService.setDefaultLanguage();
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
      const actionSheet = await this.actionSheetController.create({
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
    this.zone.run(()=>{

      this.translate.use(lang);
      this.appComponent.languageChange(lang);
      this.storage.set('language',lang);
  
      console.log("LANGUAGE CHANGE IN SIGNUP PAGE:",lang);
      this.currentLanguage = lang;
    });

    }
  

  async createUser(form:NgForm){
    try{
      await this.database.addUser(this.name,this.email,this.phoneNumber,this.password);
      // const englishMessage=enMessages.MESSAGES.userCreated;
      // const spanishMessage=esMessages.MESSAGES.userCreated;
      // const msg=this.translate.currentLang === 'en' ? englishMessage:spanishMessage
      const messageKey = 'MESSAGES.userCreated'; // Example message key
        const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message:message,
        duration: 2000, // Duration in milliseconds
        color: 'success' // Color of the toast
      });
      toast.present();

      this.showSignup=false;
      this.signupForm.resetForm();
        this.signupForm.control.markAsPristine();
        this.signupForm.control.markAsUntouched();
      //this.router.navigate(['/home']);
    }

    catch(e){
      const messageKey = 'MESSAGES.emailExists'; // Example message key
        const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        color: 'danger' // Color of the toast
      });
      toast.present();
      console.log("Email or Phone Number already exists");
    }
    finally{
      this.name='';
      this.email='';
      this.phoneNumber='';
      this.password='';
    }
  }

  async loginUser(form:NgForm){
    try{
      console.log("Name and Password",this.email,this.password);
      if(this.email!=''&& this.password!=''){

        const res=await this.database.loginUser(this.email,this.password);
        if(res.values?.length==1){
          const messageKey = 'MESSAGES.loggedIn'; // Example message key
        const message = this.translate.instant(messageKey);

          const toast = await this.toastController.create({
           message: message,
           duration: 2000, // Duration in milliseconds
           color: 'success' // Color of the toast
         });
         toast.present();
         this.loginForm.resetForm();
        this.loginForm.control.markAsPristine();
        this.loginForm.control.markAsUntouched();
        console.log("GPK-1");
        this.navCtrl.navigateRoot(['/home']);
        // this.router.navigate(['/home1']);
        console.log("GPK-2");

        }
        else{
          const messageKey = 'MESSAGES.emailPhoneError'; // Example message key
        const message = this.translate.instant(messageKey);
          const toast = await this.toastController.create({
            message: message,
            duration: 2000, // Duration in milliseconds
            color: 'danger' // Color of the toast
          });
          toast.present();
        }
      }
      else{
        const messageKey = 'MESSAGES.enterDetails'; // Example message key
        const message = this.translate.instant(messageKey);
        const toast = await this.toastController.create({
          message: message,
          duration: 2000, // Duration in milliseconds
          color: 'danger' // Color of the toast
        });
        toast.present();

      }

    }
    catch(e){
      const messageKey = 'MESSAGES.emailPhoneError'; // Example message key
        const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        color: 'danger' // Color of the toast
      });
      toast.present();
      console.log("Email or Phone Number already exists");

    }

  }

  ngOnInit(){
        
  }
  toLogin(){
    this.loginForm.resetForm();
        this.loginForm.control.markAsPristine();
        this.loginForm.control.markAsUntouched();
        this.signupForm.resetForm();
        this.signupForm.control.markAsPristine();
        this.signupForm.control.markAsUntouched();
  }
  toSignup(){
    this.loginForm.resetForm();
    this.loginForm.control.markAsPristine();
    this.loginForm.control.markAsUntouched();
    this.signupForm.resetForm();
    this.signupForm.control.markAsPristine();
    this.signupForm.control.markAsUntouched();

  }

}
