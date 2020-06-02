import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Network } from '@capacitor/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotForm: FormGroup;
  submitted: boolean=false;
  loading:boolean=false;
  loader:any=null;
  private network:boolean;
  constructor(private formBuilder: FormBuilder,
    private usersService:UsersService,
    public toastController: ToastController,
    public loadingController: LoadingController
    ) { }

  ngOnInit() {
    this.initForm();

  }
  initForm()
  {
    this.forgotForm = this.formBuilder.group(
      {
        email: ['', [Validators.required,Validators.email]]
      }
    );
  }
  get f() { return this.forgotForm.controls; }
  async submit(){
    this.submitted=true;
    if(this.forgotForm.invalid)
    {
      return;
    }
    let status = await Network.getStatus();
    if(!status.connected)
    {
      window.alert("Vérifiez votre accès internet");
      return;
    }
    this.loader = await this.loadingController.create({
      message: "Attendez s'il vous plaît..."
    });
    let x=await this.loader.present();
    this.usersService.PasswordRecover(this.forgotForm.value['email'])
    .then(async () => {
        await this.loader.dismiss();
        window.alert('Un e-mail de réinitialisation du mot de passe a été envoyé, veuillez vérifier votre boîte de réception.');
      }).catch(async (error) => {
          await this.loader.dismiss();
          if(error.message.indexOf("The email address is badly formatted")!==-1)
          {
            window.alert("L'adresse e-mail est mal formatée")
          }
          else{
            window.alert("Aucun enregistrement utilisateur ne correspond à cet identifiant. L'utilisateur a peut-être été supprimé.");
          }
          
      
    })
  }

}
