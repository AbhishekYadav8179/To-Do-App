import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, WritableSignal, signal } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Task } from '../services/database.service';
import {register} from 'swiper/element/bundle';
import Swiper from 'swiper';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../services/storage.service';
register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("swiperEx") swiperEx?: ElementRef<{swiper:Swiper}>

  
  menuContent:any;
  p:number=1;
  itemsPerPage:number=2;
  //public taskList:WritableSignal<Task[]>=signal<Task[]>([]);
  taskList:Task[]=[];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  activeButton: string = '';
  completedTasks:Task[]=[];
  incompleteTasks:Task[]=[];
  filterTaskLength:any[]=[];


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



  paddingBottom: string = '';
  lang:string='';

  constructor(private database:DatabaseService,private router:Router,public toastController:ToastController,
     private alertController:AlertController,private actionSheetCtrl:ActionSheetController,private zone:NgZone,
     private platform:Platform,private translate:TranslateService,public storage:StorageService){
          this.platform.ready().then(() => {
            if (this.platform.is('android')) {
              this.paddingBottom = '20px';
            }
          });
          
     }

  async ngOnInit(){
    console.log("CALLED....Home page");
    this.lang = await this.storage.get('language');
          console.log("LANGUAGE:",this.lang);
          this.translate.setDefaultLang(this.lang);
    await this.loadData();

    // if (this.platform.is('android')) {
    //   const slide = document.querySelector('.swiper-slide') as HTMLElement;
    //   if (slide) {
    //     slide.style.paddingBottom = '20px'; 
    //   }
    // }
  //  length=this.filteredTasks.length;
  //  let tmparr:any[]=[];
  //  for(let i=0;i<length/2;i++){
  //   tmparr.push(i+1);
  //  }
  //  this.filterTaskLength = [...tmparr];
  //  console.log("gpk-length:", length)
  //  console.log("gpk-tmparr:", tmparr)
  //  console.log("gpk-filterTaskLength :", this.filterTaskLength)
   
  }
  ngAfterViewInit() {
    
  }
  


  
  async ionViewDidEnter(){
    console.log("CALLED >>>>IONVIEWDIDENTER");
    this.lang = await this.storage.get('language');
          console.log("LANGUAGE:",this.lang);
          this.translate.use(this.lang);
    this.loadData();
  }
  async loadData(){
    try{
      await this.database.loadTasks();
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
      this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
  
  
       console.log("NGONINIT TASKS: ",this.database.tasks);
       this.taskList =this.database.tasks as Task[];
       this.filteredTasks = [...this.taskList];
  
       console.log("TASK LIST:",this.taskList);
       length=this.filteredTasks.length;
     let tmparr:any[]=[];
     for(let i=0;i<length/2;i++){
      tmparr.push(i+1);
     }
     this.filterTaskLength = [...tmparr];
    }catch(err){
      console.log("Error: ", err);
    }
  }




  toTaskForm(){
    this.router.navigate(['/to-do-form']);
    this.activeButton='All';
  }

  filterTasks(event: any) {
    try{

      this.searchTerm = event.detail.value;
      if (!this.searchTerm) {
        this.filteredTasks = this.taskList.filter((task) => {
          return (this.activeButton == 'All' || task.taskStatus == this.activeButton   );
         });
        return;
      }
      console.log("\n ---------- Start -----  -\n\n\n")
      this.filteredTasks = this.taskList.filter((task) =>{
        console.log(task.taskName,"Activebtn: ",this.activeButton," - Task: ", task.taskStatus, this.activeButton == 'All' || task.taskStatus == this.activeButton  );
  
        return (
          (this.activeButton == 'All' || task.taskStatus == this.activeButton  )&&  (task.taskName.toLowerCase().includes(this.searchTerm.toLowerCase())  || task.taskPriority.toLowerCase().includes(this.searchTerm.toLowerCase())
          || task.taskDescription.toLowerCase().includes(this.searchTerm.toLowerCase()) || task.taskStatus.toLowerCase().includes(this.searchTerm.toLowerCase()))
        
        )
      }
      
        );
        //this.cdr.detectChanges();
    }catch(err){
      console.log("Error: ", err);
    }
  }

  async changeStatus(task:Task){
    try{

      await this.database.changeTaskStatus(task);
      this.loadData();
    }catch(err){
      console.log("Error: ", err);
    }
  }

  async deleteTask(task:Task){
    try{
      const headerKey='ALERT.confirmDelete';
      const header=this.translate.instant(headerKey);
      const messageKey='ALERT.confirmDelete';
      const message=this.translate.instant(messageKey);
      const cancel=this.translate.instant('ALERT.cancel');
      const ok=this.translate.instant('ALERT.ok');
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            handler: () => {
              console.log('Delete cancelled');
            },
          },
          {
            text: ok,
            handler: async () => {
              await this.database.deleteTaskById(task);
              this.loadData();
              const messageKey = 'MESSAGES.taskDeleted'; // Example message key
              const message = this.translate.instant(messageKey);
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, // Duration in milliseconds
                color: 'success' // Color of the toast
              });
              toast.present();
              console.log('Task deleted');
              // Add your deletion logic here, for example:
              // this.taskService.deleteTask(task.id);
            },
          },
        ],
      });
      await alert.present();
      //this.cdr.detectChanges();
    }
    catch(E){
      const messageKey = 'MESSAGES.taskNotDeleted'; // Example message key
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

  async taskUpdate(task:Task){
    try{
      let params={
        taskId:task.taskId,
        taskName:task.taskName,
        taskPriority:task.taskPriority,
        taskDescription:task.taskDescription
      }
    this.router.navigate(['/update-task',params]);
    this.loadData();
   // this.cdr.detectChanges();
    
    

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
  

  loadCompletedData(){
    try{

    
    //this.swiper?.slideTo(0);
    // this.swiper.initialSlide=0;
    //this.mySwiper.slideTo(0, 1000, true);
    this.zone.run(()=>{

      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
      this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
  
      this.swiperEx?.nativeElement.swiper.update();
      this.completedTasks = this.taskList.filter((task) =>
          task.taskStatus.toLowerCase().includes('completed')
      );
      this.filteredTasks=[...this.completedTasks];
  
      length=this.filteredTasks.length;
     let tmparr:any[]=[];
     for(let i=0;i<length/2;i++){
      tmparr.push(i+1);
     }
     this.filterTaskLength = [...tmparr];
    })
    //this.cdr.detectChanges();
  }catch(err){
    console.log("Error: ", err);
  }


  }
  loadIncompleteData(){
    try{

    
    console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
    this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
    console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);

    this.swiperEx?.nativeElement.swiper.update();
    
    this.filteredTasks = this.taskList.filter((task) =>
        task.taskStatus.toLowerCase().includes('incomplete')
    );
    console.log("INCOMPLETED DATA:-------",this.filteredTasks);
    length=this.filteredTasks.length;
   let tmparr:any[]=[];
   for(let i=0;i<length/2;i++){
    tmparr.push(i+1);
   }
   this.filterTaskLength = [...tmparr];
   // this.cdr.detectChanges();
  }catch(err){
    console.log("Error: ", err);
  }

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'High',
          handler:()=>{
            this.filterByHigh();
          }
        },
        {
          text: 'Medium',
          handler:()=>{
            this.filterByMedium();
          }
        },
        {
          text: 'Low',
          handler:()=>{
            this.filterByLow();
          }
        },
      ],
    });

    await actionSheet.present();
  }
  filterByHigh(){
    try{

      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
      this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
  
      console.log("HIGH");
      this.filteredTasks = this.taskList.filter((task) =>{
        return(
          (this.activeButton == 'All' || task.taskStatus == this.activeButton  )&& (task.taskPriority.toLowerCase().includes('high'))
    
        )
      }
      );
      console.log("HIGH---ENd");
      //this.cdr.detectChanges();
    }catch(err){
      console.log("Error: ", err);
    }

  }
  filterByMedium(){
    try{

      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
      this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
  
      this.filteredTasks = this.taskList.filter((task) =>{
      return(
        (this.activeButton == 'All' || task.taskStatus == this.activeButton  )&& (task.taskPriority.toLowerCase().includes('medium'))
  
      )
    }
      );
      //this.cdr.detectChanges();
    }catch(err){
      console.log("Error: ", err);
    }
  }
  filterByLow(){
    try{

      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
      this.swiperEx?.nativeElement.swiper.slideTo(0,1,true);
      console.log("INDEX:",this.swiperEx?.nativeElement.swiper.activeIndex);
  
      this.filteredTasks = this.taskList.filter((task) =>{
        return(
          (this.activeButton == 'All' || task.taskStatus == this.activeButton  )&& (task.taskPriority.toLowerCase().includes('low'))
    
        )
      }
      );
      //this.cdr.detectChanges();
    }catch(err){
      console.log("Error: ", err);
    }
  }

}
