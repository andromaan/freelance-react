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
  useUpdateFreelancerSkillsMutation,
  useAddPortfolioMutation,
  useRemovePortfolioMutation,
} from "../../services/freelancer/freelancerApi";
import {
  useGetEmployerQuery,
  useUpdateEmployerMutation,
} from "../../services/employer/employerApi";
import { useGetCountriesQuery } from "../../services/countries/countriesApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import { useGetSkillsQuery } from "../../services/skills/skillsApi";
import {
  FormField,
  inputClass,
  SubmitButton,
  FormErrorAlert,
} from "../../components/ui/FormKit";
import { useSelectStyles, type SelectOption } from "../../styles/selectStyles";
import { toast } from "react-toastify";
import APP_ENV from "../../env";
import { userImageUrl } from "../../utils";

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
  const { data: allSkills = [] } = useGetSkillsQuery(undefined, {
    skip: !isFreelancer,
  });

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
  const [updateSkills, { isLoading: isUpdatingSkills }] =
    useUpdateFreelancerSkillsMutation();
  const [addPortfolio, { isLoading: isAddingPortfolio }] =
    useAddPortfolioMutation();
  const [removePortfolio, { isLoading: isRemovingPortfolio }] =
    useRemovePortfolioMutation();

  const isUpdating =
    isUpdatingUser ||
    isUpdatingFreelancer ||
    isUpdatingEmployer ||
    isUpdatingSkills;

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
  const [selectedSkills, setSelectedSkills] = useState<
    readonly SelectOption<number>[]
  >([]);

  // Portfolio
  const [portTitle, setPortTitle] = useState("");
  const [portDesc, setPortDesc] = useState("");
  const [portUrl, setPortUrl] = useState("");

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
      if (freelancer.skills) {
        setSelectedSkills(
          freelancer.skills.map((s) => ({ value: s.id, label: s.name })),
        );
      }
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
  const skillOptions = useMemo(
    () => allSkills.map((s) => ({ value: s.id, label: s.name })),
    [allSkills],
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
        await updateSkills({
          skillIds: selectedSkills.map((s) => s.value),
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
      toast.error(
        err?.data?.title || err?.data?.message || "Could not remove language.",
      );
    }
  };

  const handleAddPortfolio = async () => {
    if (!portTitle.trim()) {
      toast.error("Portfolio title is required.");
      return;
    }
    try {
      await addPortfolio({
        title: portTitle,
        description: portDesc || undefined,
        portfolioUrl: portUrl || undefined,
      }).unwrap();
      setPortTitle("");
      setPortDesc("");
      setPortUrl("");
      toast.success("Portfolio item added.");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.title || err?.data?.message || "Could not add portfolio.",
      );
    }
  };

  const handleRemovePortfolio = async (id: string) => {
    try {
      await removePortfolio(id).unwrap();
      toast.success("Portfolio item removed.");
    } catch (err: any) {
      console.error(err);
      toast.error("Could not remove portfolio item.");
    }
  };

  const firstLetter = (user?.displayName ||
    user?.email ||
    "?")[0].toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl pb-10">
      {errorMsg && <FormErrorAlert message={errorMsg} />}

      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="flex gap-6 flex-col lg:flex-row">
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
                        avatarPreview || userImageUrl(user?.avatarImg?? "")
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
              </div>
            </div>
          </div>

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
                    style={{
                      fieldSizing: "content",
                      minHeight: "3lh",
                      maxHeight: "10lh",
                    }}
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

      {isFreelancer && (
        <>
          {/* Skills Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
              Skills
            </h2>
            <div className="max-w-xl">
              <FormField id="skills" label="Selected Skills">
                <Select
                  isMulti
                  inputId="skills"
                  options={skillOptions}
                  value={selectedSkills}
                  onChange={(newValue) => setSelectedSkills(newValue)}
                  styles={selectStyles}
                  placeholder="Select skills..."
                  menuPlacement="auto"
                />
              </FormField>
            </div>
          </div>

          {/* Portfolio Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
              Portfolio
            </h2>

            <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                Add New Item
              </h3>
              <div className="space-y-4 max-w-xl">
                <FormField id="portTitle" label="Title" required>
                  <input
                    id="portTitle"
                    type="text"
                    value={portTitle}
                    onChange={(e) => setPortTitle(e.target.value)}
                    placeholder="Project Name"
                    className={inputClass}
                  />
                </FormField>
                <FormField id="portDesc" label="Description">
                  <textarea
                    id="portDesc"
                    rows={3}
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    placeholder="Short description..."
                    className={inputClass + " resize-y"}
                  />
                </FormField>
                <FormField id="portUrl" label="Link (URL)">
                  <input
                    id="portUrl"
                    type="url"
                    value={portUrl}
                    onChange={(e) => setPortUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </FormField>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddPortfolio}
                    disabled={isAddingPortfolio || !portTitle.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-60"
                  >
                    {isAddingPortfolio ? "Adding..." : "Add to Portfolio"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {freelancer?.portfolio && freelancer.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {freelancer.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 relative group"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 pr-6">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.portfolioUrl && (
                        <a
                          href={item.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View Link &rarr;
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolio(item.id)}
                        disabled={isRemovingPortfolio}
                        className="absolute top-3 right-3 p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md"
                        title="Remove Portfolio Item"
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
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No portfolio items yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
          Languages
        </h2>
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
