"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/types";


const fetchUserProfile = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}?profile=true`);
  if (!response.ok) {
    throw new Error(`Error fetching user profile: ${response.status}`);
  }
  return await response.json();
};

const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error updating user profile: ${response.status}`);
    }
    return await response.json();
};


export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    image: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    image: '',
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          setError(null);
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          setEditedProfile(profile);
        } catch (error) {
          console.error(error);
          setError("Failed to load user profile. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("User ID is undefined");
      }
    };

    getUserProfile();
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      
    }
  };
  
  const handleImageUpload = async () => {
    if (newImage && session?.user?.id) {
      const formData = new FormData();
      formData.append('image', newImage);
  
      try {
        const response = await fetch(`/api/users/${session.user.id}/image`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
  
        const data = await response.json();
        setEditedProfile(prev => ({ ...prev, image: data.imageUrl }));
        setNewImage(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone || '',
      image: userProfile.image || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
  };

  const handleSave = async () => {
    if (session?.user?.id) {
      try {
        setIsLoading(true);
        setError(null);
  
        const formData = new FormData();
        formData.append('name', editedProfile.name);
        formData.append('email', editedProfile.email);
        formData.append('phone', editedProfile.phone);
  
        if (newImage) {
          formData.append('image', newImage);
        }
  
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: 'PUT',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to update user profile');
        }

        const data: Partial<UserProfile> = {
          ...editedProfile,
          image: editedProfile.image || undefined
        };
  
        const updatedProfile = await updateUserProfile(session?.user?.id, data);
        setUserProfile(updatedProfile);
        setIsEditing(false);
        setNewImage(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error(error);
        setError("Failed to update user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background bg-gradient-to-br from-yellow-200 via-black to-white text-white">
      <hr className="border-t border-white" />
      <header className="bg-black py-8">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-white text-center">
            Profile
          </h1>
          {/* <div className="flex items-center space-x-4">
            <span>{session?.user?.name || ""} </span>
            <Image
              src={previewUrl || editedProfile.image || "/placeholder.svg?height=128&width=128"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>           */}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 m-10">
        <Card>
          <CardHeader>
            <CardTitle>Hello, <span>{userProfile.name} </span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image
                  src={previewUrl || editedProfile.image || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              {isEditing ? (
                <>
                  <Input
                    name="name"
                    value={editedProfile.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <Input
                    name="email"
                    value={editedProfile.email || ''}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                  />
                  <Input
                    name="phone"
                    value={editedProfile.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <Input
                    name="image"
                    value={editedProfile.image || ''}
                    onChange={handleChange}
                    placeholder="Image URL"
                  />
                  <div className="flex justify-end space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                    <Button onClick={handleImageUpload} disabled={!newImage}>
                      Upload
                    </Button>
                    <Button onClick={handleCancel} variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {userProfile.name}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Phone:</strong> {userProfile.phone || 'Not provided'}</p>
                  <div className="flex justify-end">
                    <Button onClick={handleEdit}>Edit Profile</Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-black py-6 mt-6">
        <div className="container mx-auto text-center">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} Shareflyt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}