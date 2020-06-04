import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.scss'],
})
export class MonCompteComponent implements OnInit {

  private obsUser:Observable<any>;
  private user:any;
  private userForm:FormGroup;
  private mdpForm:FormGroup;
  private submitted:boolean=false;
  constructor(private usersService:UsersService,
              private formBuilder: FormBuilder
            ) { }

  ngOnInit() {
    this.obsUser=this.usersService.userOb;
    this.obsUser.subscribe((data)=>{
      this.user=data;
      if(data)
      this.initForm();
    });
    this.initFormMdp();
  }
  initForm(){
    
    this.userForm=this.formBuilder.group({
      nom: [this.user.nom, [Validators.required,Validators.minLength(3)]],
      prenom: [this.user.prenom, [Validators.required,Validators.minLength(3)]],
      email: [this.user.email, [Validators.required,Validators.email]],
      telephone: [this.user.telephone, [Validators.required,Validators.minLength(8),
      Validators.pattern(/^([0-9]{3})[0-9]+/)]],

    })
  }
  initFormMdp(){
    this.mdpForm=this.formBuilder.group({
      mdp: ['', [Validators.required,Validators.minLength(6)]],
      remdp: ['', [Validators.required,Validators.minLength(6)]],
    });
  }
  modifier(){

  }

}
