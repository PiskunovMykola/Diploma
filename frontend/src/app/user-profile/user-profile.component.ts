import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ProjectingService } from '../services/projecting.service';
import { User } from '../model/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  currentUserId: string | null = null;
  
  // Variables for photo
  selectedImageFile: File | null = null;
  previewImage: string | null = null; 
  isImageUploading: boolean = false;

  constructor(
    private userService: UserService,
    private projectingService: ProjectingService, 
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // === 1. CRITICAL FIX: Initialize form IMMEDIATELY ===
    // This prevents the "formGroup expects a FormGroup instance" error
    this.createForm(); 

    // 2. Get current UID
    if (typeof localStorage !== 'undefined') {
        this.currentUserId = localStorage.getItem('token');
    }

    if (!this.currentUserId) {
      this.toastr.error('You are not authorized');
      return;
    }

    // 3. Load data from Firebase
    this.userService.getUser(this.currentUserId).subscribe((data: any) => {
      if (data) {
        this.user = data;
        
        // Update form with data from database
        this.profileForm.patchValue({
          userName: data.userName,
          email: data.email, 
          mobile: data.mobile,
          bio: data.bio || ''
        });

        // Show existing photo if available
        if (data.profileImage) {
            this.previewImage = data.profileImage;
        }
      }
    });
  }

  createForm() {
    this.profileForm = this.fb.group({
        userName: [null, Validators.required],
        email: [{ value: '', disabled: true }], // Email is disabled
        mobile: [null, [Validators.required, Validators.maxLength(10)]],
        bio: [null, Validators.maxLength(500)]
      });
  }

  // === SELECT PHOTO ===
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;

      // Create local preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // === SUBMIT ===
  onSubmit(): void {
    if (this.profileForm.valid && this.currentUserId) {
        
        // If new photo selected, upload it first
        if (this.selectedImageFile) {
            this.isImageUploading = true;
            this.projectingService.uploadFile(this.selectedImageFile).subscribe({
                next: (photoUrl) => {
                    this.isImageUploading = false;
                    this.saveUserData(photoUrl); // Save data with new link
                },
                error: (err) => {
                    console.error(err);
                    this.isImageUploading = false;
                    this.toastr.error('Error uploading photo');
                }
            });
        } else {
            // If photo didn't change, keep the old one
            const oldImage = this.user?.profileImage || '';
            this.saveUserData(oldImage);
        }

    } else {
      this.toastr.error('Please fill in required fields');
    }
  }

  saveUserData(imageUrl: string) {
    if (!this.currentUserId) return;

    // Collect object
    const updatedUser: any = {
        userName: this.profileForm.get('userName')?.value,
        mobile: this.profileForm.get('mobile')?.value,
        bio: this.profileForm.get('bio')?.value,
        email: this.user?.email, // Keep email safe
        profileImage: imageUrl
    };
    
    // Preserve Role if exists
    if (this.user && (this.user as any).role) {
        updatedUser.role = (this.user as any).role;
    }

    this.userService.updateUser(this.currentUserId, updatedUser)
        .then(() => {
            this.toastr.success('Profile updated successfully!');
            // Update local storage for Navbar to reflect name change immediately
            localStorage.setItem('userName', updatedUser.userName);
        })
        .catch(err => {
            this.toastr.error('Error saving data');
            console.error(err);
        });
  }
}