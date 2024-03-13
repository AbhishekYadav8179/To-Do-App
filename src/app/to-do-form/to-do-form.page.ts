import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-to-do-form',
  templateUrl: './to-do-form.page.html',
  styleUrls: ['./to-do-form.page.scss'],
})
export class ToDoFormPage implements OnInit {

  taskName='';
  taskPriority='';
  taskDescription='';
  taskStatus='Incomplete';
  userId=this.database.loginUserId;

  priorities: string[] = ['High', 'Medium', 'Low'];

  constructor(private database:DatabaseService,private toastController:ToastController,private router:Router,
    private translate:TranslateService,private actionSheetCtrl:ActionSheetController,public storage:StorageService) { 
      

    }

    lang:string='';
  async ngOnInit() {
    this.lang = await this.storage.get('language');
          console.log("LANGUAGE:",this.lang);
          this.translate.setDefaultLang(this.lang);
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

  goBack(){
    this.router.navigate(['/home']);
  }

  async onSubmit() {
    if(this.taskName!='' && this.taskPriority!='' && this.taskDescription!=''){

      try{
        await this.database.addTask(this.taskName,this.taskPriority,this.taskDescription,this.taskStatus,this.userId);
        const messageKey = 'MESSAGES.taskAdded'; // Example message key
        const message = this.translate.instant(messageKey);
        const toast = await this.toastController.create({
          message: message,
          duration: 2000, // Duration in milliseconds
          color: 'success' // Color of the toast
        });
        toast.present();
        this.router.navigate(['/home']);
      }
      catch(e){
        const messageKey = 'MESSAGES.taskNotCreated'; // Example message key
        const message = this.translate.instant(messageKey);
        const toast = await this.toastController.create({
          message: message,
          duration: 2000, // Duration in milliseconds
          color: 'danger' // Color of the toast
        });
        toast.present();
        console.log("Task Not Created");
  
      }
    }
    else{
      const messageKey = 'MESSAGES.enterTaskDetails'; // Example message key
      const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        color: 'danger' // Color of the toast
      });
      toast.present();
      console.log("Task Not Created");

    }
  }

}
