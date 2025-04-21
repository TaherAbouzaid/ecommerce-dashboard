import { Component, OnInit } from '@angular/core';
// import { ImportsModule } from './imports';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
// import { Editor } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-Test',
  templateUrl: './Test.component.html',
  standalone: true,
  styleUrls: ['./Test.component.css'],
  imports: [ReactiveFormsModule, CommonModule, EditorModule, ButtonModule, FormsModule]
})
export class TestComponent implements OnInit {
formGroup!: FormGroup;
text: any;

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl()
        });
    }
}

