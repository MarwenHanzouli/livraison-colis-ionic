import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

import { MustMatch } from 'src/app/helpers/validators';
import { HomeService } from 'src/app/services/home.service';
import { UsersService } from 'src/app/services/users.service';
import { Plugins } from '@capacitor/core';
import {FCM} from 'capacitor-fcm';
import { User } from 'src/app/models/User.model';
const fcm = new FCM();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit , OnDestroy {


  registerForm: FormGroup;
  submitted: boolean=false;
  registred:boolean=false;
  loading:boolean=false;
  type:string;
  eye:string;
  color:string;
  loader:any=null;
  emailRegistred:boolean=false;
  role:string="Client";
  subscribe:Subscription;
  constructor(private formBuilder: FormBuilder,
              private usersService:UsersService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private homeService:HomeService) { }

  ngOnInit() {
    this.initForm();
    this.type="password";
    this.eye="eye-off";
    this.color="primary";
  }
  initForm()
  {
    this.registerForm = this.formBuilder.group(
      {
        firstName:['', Validators.required],
        lastName:['', Validators.required],
        phone:['', [Validators.required,Validators.pattern(/^[0-9]*$/)]],
        email: ['', [Validators.required,Validators.email]],
        password: ['', [Validators.required,Validators.minLength(6)]],
        repassword: ['', [Validators.required,Validators.minLength(6)]]
      },{
        validator: MustMatch('password', 'repassword')
      }
    );
  }
  get f() { return this.registerForm.controls; }
  changePassword(){
    if(this.type==="password"){
      this.type="text";
      this.eye="eye";
    }else{
      this.type="password";
      this.eye="eye-off";
      this.color="primary"
    }
  }
  async register(){
    this.submitted=true;
    if(this.registerForm.invalid)
    {
      return;
    }
    this.loader = await this.loadingController.create({
      message: "S'il vous plaît, attendez..."
    });
    //const {token} = await fcm.getToken();
    //console.log(token) 
    let user=new User(this.registerForm.value['lastName'],this.registerForm.value['firstName'],
    this.registerForm.value['email'],this.registerForm.value['phone'],this.registerForm.value['password'],
    this.registerForm.value['role']);
    user.role=this.role;
    console.log(user)
    let x=await this.loader.present();
    this.subscribe=this.usersService.register(user).subscribe(async (data)=>{
      console.log(data);
      this.loader.dismiss();
      this.registred=true;
      await this.usersService.SendVerificationMail();
      let y=await this.presentToast("Cette inscription est terminée avec succès",3000);
      this.homeService.displayLogin();
    },
    (error)=>{
      console.log(error.error.message);
      this.loader.dismiss();
      
      if(error.error.message.indexOf("The email address is improperly formatted")!==-1)
      {
        this.presentToast("Format de l'e-mail est incorrect")
      }
      else if(error.error.message.indexOf("The email address is already in use by another account")!==-1)
      {
        this.emailRegistred=true;
        this.presentToast("Essayez avec un autre e-mail");
      }
      
    });  
  }
  async presentLoading(){
    this.loader = await this.loadingController.create({
      message: 'Please wait...'
    });
    return await this.loader.present(); 
  }
  async dismissLoading(){
    await this.loader.dismiss();
  }
  async presentToast(message,dur?) {
    const toast = await this.toastController.create({
      message: message,
      duration: dur ? dur : 2000
    });
    return toast.present();
  }
  show(v){
    this.role=v;
    console.log(this.role)
  }

  ngOnDestroy(): void {
    if(this.subscribe)
    this.subscribe.unsubscribe();
  }
}
