import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  constructor(private translate:TranslateService,public router:Router) { }

  ngOnInit() {
  }

  changeLanguage(str:string){
    this.translate.use(str);
    this.router.navigate(['/signup']);
  }

}
