import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { selectCurrentUser } from "../../store/userSlice";
import { ROLES } from "../../constants/roles";
import {
  useUpdateUserMutation,
  useGetProficiencyLevelsQuery,
  useAddUserLanguageMutation,
  useRemoveUserLanguageMutation,
  useUpdateAvatarMutation,
} from "../../services/user/userApi";
import {
  useGetFreelancerByEmailQuery,
  useUpdateFreelancerMutation,
} from "../../services/freelancer/freelancerApi";
import {
  useGetEmployerQuery,
  useUpdateEmployerMutation,
} from "../../services/employer/employerApi";
import { useGetCountriesQuery } from "../../services/countries/countriesApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import {
  FormField,
  inputClass,
  SubmitButton,
  FormErrorAlert,
} from "../../components/ui/FormKit";
import { useSelectStyles, type SelectOption } from "../../styles/selectStyles";
import { toast } from "react-toastify";
import APP_ENV from "../../env";

export const EditProfileTab: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const isFreelancer = user?.role?.name === ROLES.FREELANCER;
  const email = user?.email || "";

  // ─── Styles ───
  const selectStyles = useSelectStyles<number>();

  // ─── API Hooks ───
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: allLanguages = [] } = useGetLanguagesQuery();
  const { data: proficiencies = [] } = useGetProficiencyLevelsQuery();

  const { data: freelancer } = useGetFreelancerByEmailQuery(email, {
    skip: !isFreelancer || !email,
  });
  const { data: employer } = useGetEmployerQuery(undefined, {
    skip: isFreelancer,
  });

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateFreelancer, { isLoading: isUpdatingFreelancer }] =
    useUpdateFreelancerMutation();
  const [updateEmployer, { isLoading: isUpdatingEmployer }] =
    useUpdateEmployerMutation();
  const [addLanguage, { isLoading: isAddingLang }] =
    useAddUserLanguageMutation();
  const [removeLanguage, { isLoading: isRemovingLang }] =
    useRemoveUserLanguageMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateAvatarMutation();

  const isUpdating =
    isUpdatingUser || isUpdatingFreelancer || isUpdatingEmployer;

  // ─── Local State ───
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Avatar
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // User
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [selectedCountry, setSelectedCountry] =
    useState<SelectOption<number> | null>(null);

  // Language Adding
  const [langToAdd, setLangToAdd] = useState<SelectOption<number> | null>(null);
  const [profToAdd, setProfToAdd] = useState<SelectOption<number> | null>(null);

  // Freelancer
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Employer
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Init Data
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      if (user.country?.id) {
        setSelectedCountry({
          value: user.country.id,
          label: user.country.name,
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (freelancer) {
      setBio(freelancer.bio || "");
      setLocation(freelancer.location || "");
    }
  }, [freelancer]);

  useEffect(() => {
    if (employer) {
      setCompanyName(employer.companyName || "");
      setCompanyWebsite(employer.companyWebsite || "");
    }
  }, [employer]);

  // Options
  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.id, label: c.name })),
    [countries],
  );
  const langOptions = useMemo(
    () => allLanguages.map((l) => ({ value: l.id, label: l.name })),
    [allLanguages],
  );
  const profOptions = useMemo(
    () => proficiencies.map((p) => ({ value: p.value, label: p.name })),
    [proficiencies],
  );

  // ─── Handlers ───
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedAvatar) return;
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedAvatar);
      await updateAvatar(formData).unwrap();
      toast.success("Profile image updated successfully.");
      setSelectedAvatar(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.title || err?.data?.message || "Could not update avatar.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedCountry) {
      setErrorMsg("Country is required.");
      return;
    }

    try {
      await updateUser({
        displayName: displayName || null,
        countryId: selectedCountry.value,
      }).unwrap();

      if (isFreelancer) {
        await updateFreelancer({
          bio: bio || null,
          location: location || null,
        }).unwrap();
      } else {
        await updateEmployer({
          companyName: companyName || null,
          companyWebsite: companyWebsite || null,
        }).unwrap();
      }

      toast.success("Profile updated successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.title ||
          err?.data?.message ||
          "An error occurred while updating profile.",
      );
    }
  };

  const handleAddLanguage = async () => {
    if (!langToAdd || profToAdd === null) return;
    try {
      await addLanguage({
        languageId: langToAdd.value,
        proficiencyLevel: profToAdd.value,
      }).unwrap();
      setLangToAdd(null);
      setProfToAdd(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.title || err?.data?.message || "Could not add language.",
      );
    }
  };

  const handleRemoveLanguage = async (langId: number) => {
    try {
      await removeLanguage(langId).unwrap();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.title || err?.data?.message || "Could not remove language.",
      );
    }
  };

  const firstLetter = (user?.displayName ||
    user?.email ||
    "?")[0].toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl pb-10">
      {errorMsg && <FormErrorAlert message={errorMsg} />}

      {/* Main Form */}
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Avatar Card */}
          <div className="w-1/2 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center gap-5">
              <div className="relative group w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  {avatarPreview || user?.avatarImg ? (
                    <img
                      src={
                        avatarPreview || `${APP_ENV.API_URL}/${user?.avatarImg}`
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold text-4xl">
                      {firstLetter}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-center px-2"
                >
                  Upload Image
                </label>
              </div>
              <div className="flex flex-col items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Upload Image
                  </label>
                  {selectedAvatar && (
                    <SubmitButton
                      type="button"
                      onClick={handleUpdateAvatar}
                      isLoading={isUpdatingAvatar}
                      label="Save Avatar"
                      loadingLabel="Saving..."
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recommended: Square image.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="w-1/2 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
              Basic Information
            </h2>
            <div className="space-y-5 max-w-xl">
              <FormField id="displayName" label="Display Name">
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className={inputClass}
                />
              </FormField>
              <FormField id="countryId" label="Country" required>
                <Select<SelectOption<number>>
                  inputId="countryId"
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  styles={selectStyles}
                  placeholder="Select a country..."
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Role Specific Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
            {isFreelancer ? "Freelancer Details" : "Company Details"}
          </h2>

          <div className="space-y-5">
            {isFreelancer ? (
              <>
                <FormField id="bio" label="Bio">
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell clients about yourself, your skills, and your experience..."
                    className={inputClass + " resize-y "}
                    style={{ fieldSizing: "content", minHeight: "3lh", maxHeight: "10lh" }}
                  />
                </FormField>

                <FormField id="location" label="Location / Timezone">
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className={inputClass}
                  />
                </FormField>
              </>
            ) : (
              <>
                <FormField id="companyName" label="Company Name">
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="companyWebsite" label="Company Website">
                  <input
                    id="companyWebsite"
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://acme-corp.com"
                    className={inputClass}
                  />
                </FormField>
              </>
            )}
          </div>
        </div>
      </form>

      {/* Languages Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
          Languages
        </h2>

        {/* Add New Language */}
        <div className="flex items-end gap-3 flex-wrap mb-6">
          <div className="flex-1 min-w-[200px]">
            <FormField id="add-language" label="Language">
              <Select<SelectOption<number>>
                inputId="add-language"
                options={langOptions}
                value={langToAdd}
                onChange={setLangToAdd}
                styles={selectStyles}
                placeholder="Select language..."
                menuPlacement="auto"
              />
            </FormField>
          </div>
          <div className="flex-1 min-w-[200px]">
            <FormField id="add-proficiency" label="Proficiency Level">
              <Select<SelectOption<number>>
                inputId="add-proficiency"
                options={profOptions}
                value={profToAdd}
                onChange={setProfToAdd}
                styles={selectStyles}
                placeholder="Select level..."
                menuPlacement="auto"
              />
            </FormField>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            disabled={!langToAdd || profToAdd === null || isAddingLang}
            className="px-4 py-[9px] h-[38px] mb-[2px] rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingLang ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Existing Languages List */}
        <div className="space-y-2">
          {user?.languages && user.languages.length > 0 ? (
            user.languages.map((lang) => {
              const langName =
                allLanguages.find((l) => l.id === lang.languageId)?.name ||
                `Language ${lang.languageId}`;
              return (
                <div
                  key={lang.languageId}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {langName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {lang.proficiencyLevel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(lang.languageId)}
                    disabled={isRemovingLang}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No languages added yet.
            </p>
          )}
        </div>
      </div>

      {/* Save Profile Button */}
      <div className="pt-4 flex justify-end">
        <SubmitButton
          form="edit-profile-form"
          isLoading={isUpdating}
          label="Save Profile Changes"
          loadingLabel="Saving..."
        />
      </div>
    </div>
  );
};
