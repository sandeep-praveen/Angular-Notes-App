import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SnippetService } from './snippet.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
  title = 'ngNote';

  @ViewChild('previewContainer', { static: true }) previewContainer!: ElementRef;
  @ViewChild('closeButton1') closeButton1!: ElementRef;
  @ViewChild('closeButton2') closeButton2!: ElementRef;
  @ViewChild('closeButton3') closeButton3!: ElementRef;
  @ViewChild('closeButton4') closeButton4!: ElementRef;

  snippets: any[] = [];
  activeSnippets: any;
  activeSnippet: any = {};
  activeLanguage: string = '';
  languages: any = [];
  activeOption: string = '';
  activeTab: any;
  codeTabs: any;
  deleteId: any;
  errorMsg: string = '';

  authForm: FormGroup;
  searchForm: FormGroup;
  addForm: FormGroup;
  snippetForm: FormGroup;
  editAccess: boolean = false;
  hidePassword: boolean = false;
  noData: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private snippetService: SnippetService
  ) {
    this.snippetForm = this.formBuilder.group({
      snippetName: ['', Validators.required],
      HTML: [false],
      htmlCode: [''],
      CSS: [false],
      cssCode: [''],
      JS: [false],
      jsCode: [''],
      requirements: [''],
    });

    this.addForm = this.formBuilder.group({
      language: ['', Validators.required],
    });

    this.authForm = this.formBuilder.group({
      uname: ['', Validators.required],
      pwd: ['', Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });

    this.getSnippets();
  }

  ngOnInit(): void {
    ['HTML', 'CSS', 'JS'].forEach((language) => {
      this.snippetForm.get(language)?.valueChanges.subscribe((isChecked) => {
        const control = this.snippetForm.get(`${language.toLowerCase()}Code`);
        isChecked ? control?.setValidators([Validators.required]) : (control?.clearValidators(), control?.setValue(''));
        control?.updateValueAndValidity();
      });
    });
  }

  getSnippets(): void {
    this.snippetService.getSnippets().subscribe(
      (snippets: any) => {
        // console.log(snippets);
        this.snippets = snippets?.data;
        this.languages = this.snippets.map((snippet: any) => snippet.language);
        if (this.activeLanguage !== '') {
          this.selectLanguage(this.activeLanguage);
        }
      },
      (error: any) => {
        console.error('Error fetching snippets:', error);
      }
    );
  }

  renderCode(): void {
    const activeSnippetIndex = this.activeSnippets['snippets'] ? this.activeSnippets['snippets'].findIndex((snippet: any) => snippet.name === this.activeOption) : -1;
    this.activeSnippet = activeSnippetIndex !== -1 ? this.activeSnippets['snippets'][activeSnippetIndex] : {};
    this.codeTabs = this.activeSnippet.code ? Object.keys(this.activeSnippet.code).filter(key => this.activeSnippet.code[key].trim() !== '') : {};
    this.activeTab = this.codeTabs[0];
    if (this.activeSnippet['code']) {
      this.noData = false;
      if (this.activeSnippet['code']['html']) {
        if (this.activeSnippet['code']['js']) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = `${this.activeSnippet['code']['js']}`;
          this.previewContainer.nativeElement.appendChild(script);
        }
        if (this.activeSnippet['code']['css']) {
          this.previewContainer.nativeElement.innerHTML = `<style>${this.activeSnippet['code']['css']}</style>${this.activeSnippet['code']['html']}`;
        } else {
          this.previewContainer.nativeElement.innerHTML = `${this.activeSnippet['code']['html']}`;
        }
      }
    } else {
      this.previewContainer.nativeElement.innerHTML = `<style>#{display:none}</style>`;
      this.noData = true;
    }
  }

  selectLanguage(language: string): void {
    if (this.activeLanguage === '') {
      this.getSnippets();
    }
    this.activeLanguage = language;
    this.activeSnippets = this.snippets.find((data: any) => data.language === this.activeLanguage) || [];
    this.activeOption = this.activeSnippets['snippets'] ? this.activeSnippets['snippets'][0].name : '';
    this.renderCode();
  }

  selectSnippet(option: string): void {
    this.activeOption = option;
    this.renderCode();
  }

  addLanguage(): void {
    if (this.addForm.valid) {
      const { snippetName, htmlCode, cssCode, jsCode, requirements } = this.snippetForm.value;
      const data: any = {
        language: this.addForm.value.language?.trim(),
        snippets: [{
          'name': snippetName?.trim(),
          'code': {
            'html': htmlCode?.trim() || '',
            'css': cssCode?.trim() || '',
            'js': jsCode?.trim() || '',
            'requirements': requirements?.trim() || '',
          }
        }]
      };
      this.addNewLanguage(data);
      this.addForm.reset();
      this.snippetForm.reset();
      this.closeButton1.nativeElement.click();
    }
  }

  addSnippet(): void {
    if (this.snippetForm.valid) {
      const { snippetName, htmlCode, cssCode, jsCode, requirements } = this.snippetForm.value;
      const data: any = {
        'name': snippetName?.trim(),
        'code': {
          'html': htmlCode?.trim() || '',
          'css': cssCode?.trim() || '',
          'js': jsCode?.trim() || '',
          'requirements': requirements?.trim() || '',
        }
      };
      this.addNewSnippet(data);
      this.snippetForm.reset();
      this.closeButton2.nativeElement.click();
    }
  }

  addNewLanguage(data: any) {
    this.snippetService.addLanguage(data)
      .subscribe(
        (res: any) => {
          console.log('New Language added successfully:', res);
          this.getSnippets();
        },
        (error: any) => {
          console.error('Error adding Language:', error);
          this.editAccess = false;
        }
      );
  }

  addNewSnippet(snippet: any) {
    this.snippetService.addLanguageSnippet(this.activeSnippets._id, snippet)
      .subscribe(
        (res: any) => {
          console.log('Snippet updated successfully:', res);
          this.getSnippets();
        },
        (error: any) => {
          console.error('Error updating snippet:', error);
          this.editAccess = false;
        }
      );
  }

  deleteSnippet() {
    this.snippetService.deleteSnippet(this.deleteId)
      .subscribe(
        (res: any) => {
          console.log('Snippet deleted successfully:', res);
          if (res.message === 'Snippet and its document deleted successfully') {
            this.activeLanguage = '';
          }
          this.deleteId = '';
          this.getSnippets();
          this.closeButton3.nativeElement.click();
        },
        (error: any) => {
          console.error('Error deleting snippet:', error);
          this.closeButton3.nativeElement.click();
          this.editAccess = false;
        }
      );
  }

  Authenticate() {
    if (this.authForm.valid) {
      const { uname, pwd } = this.authForm.value;
      const data: any = {
        username: uname?.trim(),
        password: pwd?.trim()
      }
      this.AuthenticateUser(data);
      this.authForm.reset();
      this.closeButton4.nativeElement.click();
    }
  }

  AuthenticateUser(data: any) {
    this.snippetService.AuthenticateUser(data)
      .subscribe(
        (res: any) => {
          console.log('Authenticate User successfully:', res);
          if (res.message == 'Authentication success') {
            this.snippetService.setItems(res.token);
            this.editAccess = true;
          }
        },
        (error: any) => {
          console.error('Error Authenticating User', error);
          this.editAccess = false;
        }
      );
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  searchSnippet() {
    const value = this.searchForm.get('search')?.value;
    if (value != '') {
      const data = {
        language: this.activeLanguage,
        snippet: value
      }
      this.snippetService.searchSnippets(data).subscribe(
        (snippets: any) => {
          snippets.data.forEach((item: any) => {
            item.language = this.activeLanguage;
          });
          this.snippets = snippets?.data;
          this.selectLanguage(this.activeLanguage);
        },
        (error: any) => {
          console.error('Error fetching snippets:', error);
        }
      );
    } else {
      this.getSnippets();
    }
  }

  clearSearch() {
    this.searchForm.get('search')?.setValue('');
    this.getSnippets();
  }

  toTitleCase(str: string): string {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  back() {
    this.activeLanguage = '';
    this.searchForm.get('search')?.setValue('')
    this.addForm.reset();
    this.authForm.reset();
    this.snippetForm.reset();
    this.noData = false;
  }
}
