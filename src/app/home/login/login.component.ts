import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User.model';
import { NetworkService } from 'src/app/services/network.service';

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
  private user:User;
  private network:boolean;
  subscribe:Subscription;

  constructor(private formBuilder: FormBuilder,
              private router:Router,
              public loadingController: LoadingController,
              private usersService:UsersService,
              public toastController: ToastController,
              private netService:NetworkService
              ) { }

  ngOnInit() {
    this.initForm();
    this.type="password";
    this.eye="eye-off";
    this.color="primary";
    this.netService.obNetwork.subscribe((data)=>{
      this.network=data.connected;
    });
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
    if(!this.network)
    {
      this.presentToast("Vérifiez votre accès internet");
    }else{
      const loading = await this.loadingController.create({
        message: "S'il vous plaît, attendez..."
      });
      await loading.present();
      let auth={
        'email':this.authForm.value['email'],
        'password':this.authForm.value['password']
      }
      this.usersService.SignIn(auth.email,auth.password).then(async (data)=>{
        console.log(data.user.getIdToken());
        this.presentToast("");
        await loading.dismiss();
      }).catch(async (error)=>{
        console.log(error);
        if(error.message.indexOf("The password is invalid or the user does not have a password")!==-1){
          this.presentToast("Le mot de passe n'est pas valide ou l'utilisateur n'a pas de mot de passe");
        }
        await loading.dismiss();
      })
      //this.subscribe=this.usersService.login(auth).subscribe(async (data)=>{
      //   if(data.length===0){
      //     this.presentToast("This account is does not exist");
      //     await loading.dismiss();
      //   }
      //   else
      //   {
      //     if(data[0].payload.doc.data()['password']===auth.password) {
      //       this.user=<User>data[0].payload.doc.data();
      //       this.user.id=data[0].payload.doc.id;
      //       this.usersService.next(this.user);
      //       this.router.navigate(['/dashboard','Home']);
      //       await Storage.set({
      //         key: "USER",
      //         value:JSON.stringify(this.user)});
      //       await loading.dismiss();
      //     }
      //     else{
      //       this.presentToast("Email or password is invalid");
      //       await loading.dismiss();
      //     }
      //   }
        
      // });
      
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
