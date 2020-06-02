import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { Plugins, Network } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {FCM} from 'capacitor-fcm';
const fcm = new FCM();
const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit ,OnDestroy{

  authForm: FormGroup;
  submitted: boolean=false;
  loading:boolean=false;
  autenticated:boolean=false;
  type:string;
  eye:string;
  color:string;
  private user:any;
  private network:boolean;
  subscribe:Subscription;

  constructor(private formBuilder: FormBuilder,
              private router:Router,
              public loadingController: LoadingController,
              private usersService:UsersService,
              public toastController: ToastController,
              private firestore:AngularFirestore,
              private platform: Platform
              ) { }

  async ngOnInit() {
    
    this.initForm();
    this.type="password";
    this.eye="eye-off";
    this.color="primary";
    
  }
  initForm()
  {
    this.authForm = this.formBuilder.group(
      {
        email: ['', [Validators.required,Validators.email]],
        password: ['', [Validators.required,Validators.minLength(6)]]
      }
    );
  }
  get f() { return this.authForm.controls; }
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
  async login(){
    this.submitted=true;
    if(this.authForm.invalid)
    {
      return;
    }
    let status = await Network.getStatus();
    if(!status.connected)
    {
      this.presentToast("Vérifiez votre accès internet");
    }else{
      const loading = await this.loadingController.create({
        message: "Attendez s'il vous plaît..."
      });
      await loading.present();
      let auth={
        'email':this.authForm.value['email'],
        'password':this.authForm.value['password']
      }
      
      this.usersService.SignIn(auth.email,auth.password).then(async (data)=>{
        let userRef=this.firestore.collection('users').doc(data.user.uid);
        userRef.get().subscribe(async(userDoc)=>{
          if(userDoc)
          {
            let tokenDevice;
            this.user=userDoc.data();
            if(this.platform.is('hybrid'))
            {
              const {token} = await fcm.getToken();
              tokenDevice=token;
              console.log(tokenDevice);
              console.log(this.user.tokens);
              if(!this.user.tokens.includes(tokenDevice)){
                this.user.tokens.push(tokenDevice);
                await userRef.set(this.user);
              }
            }
            
            if(data.user.emailVerified){
              if(!userDoc.data().emailVerified){
                this.user.emailVerified=true;
                await userRef.set(this.user);
              }
              this.usersService.next(this.user);
              await Storage.set({
                key: "USER",
                value:JSON.stringify(this.user)
              });
              await loading.dismiss();
            }
            else{
              await loading.dismiss();
              window.alert("Vérifie ton e-mail pour connecter");
            }
          }
        });
      }).catch(async (error)=>{
        if(error.message.indexOf("The password is invalid or the user does not have a password")!==-1){
          this.presentToast("Le mot de passe n'est pas valide ou l'utilisateur n'a pas de mot de passe");
        }
        else {
          this.presentToast("Pas d'utilisateur correspondant à cet identifiant")
        }
        await loading.dismiss();
      });
    }
  }

  async presentToast(message,dur?) {
    const toast = await this.toastController.create({
      message: message,
      duration: dur ? dur : 2000
    });
    await toast.present();
  }
  ngOnDestroy(): void {
    if(this.subscribe){
      this.subscribe.unsubscribe();
    }  
  }

}
