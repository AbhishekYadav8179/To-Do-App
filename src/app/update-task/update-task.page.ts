import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.page.html',
  styleUrls: ['./update-task.page.scss'],
})
export class UpdateTaskPage implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute, private database:DatabaseService,public toastController:ToastController,
    private actionSheetCtrl:ActionSheetController,private translate:TranslateService,public storage:StorageService) { 
          
    }

  id=0;
  newTaskName='';
  newTaskPriority='';
  newTaskDescription='';


  lang:string='';
  async ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log('Query Params:', params);
       this.id = params['taskId'];
       this.newTaskName = params['taskName'];
       this.newTaskPriority = params['taskPriority'];
       this.newTaskDescription = params['taskDescription'];
       console.log("IN UPDATE: ",params['param1'],this.newTaskName,this.newTaskPriority,this.newTaskDescription);
       // You can now use param1 and param2 in your component
     });
     this.lang = await this.storage.get('language');
          console.log("LANGUAGE:",this.lang);
          this.translate.setDefaultLang(this.lang);
  }
  goBack(){
    this.router.navigate(['/home']);
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
    this.storage.set('language',lang)
  }

  async onUpdate(){
    try{
      await this.database.updateTaskById(this.id,this.newTaskName,this.newTaskPriority,this.newTaskDescription);
      this.router.navigate(['/home']);
      const messageKey = 'MESSAGES.taskUpdatedSuccessfully'; // Example message key
      const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        color: 'success' // Color of the toast
      });
      toast.present();
    }
    catch(e){
      const messageKey = 'MESSAGES.taskNotUpdated'; // Example message key
      const message = this.translate.instant(messageKey);
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        color: 'danger' // Color of the toast
      });
      toast.present();
      console.log("Task Not Deleted");
    }
  }

}
