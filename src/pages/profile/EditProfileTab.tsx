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
import { avatarLetters, userImageUrl } from "../../utils";
import DeleteIcon from "../../components/icons/DeleteIcon";
import ArrowIcon from "../../components/icons/ArrowIcon";

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

  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // ─── Local State ───

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
    setErrorMsg([]);
    try {
      const formData = new FormData();
      formData.append("file", selectedAvatar);
      await updateAvatar(formData).unwrap();
      toast.success("Profile image updated successfully.");
      setSelectedAvatar(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg([
        err?.data?.title || err?.data?.message || "Could not update avatar.",
      ]);
    }
  };

  function splitCamelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")  // "CompanyName" → "Company Name"
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"); // "HTTPSConnection" → "HTTPS Connection"
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg([]);

    if (!selectedCountry) {
      setErrorMsg(["Country is required."]);
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
      setIsDirty(false);
    } catch (err: any) {
      console.error(err);

      if (err?.data?.errors) {
        const errList: string[] = [];
        for (const key in err.data.errors) {
          const readableKey = splitCamelCase(key); // "CompanyName" → "Company Name"
          const messages = err.data.errors[key].map(
            (msg: string) => msg.replace(key, readableKey), // замінюємо в оригінальному повідомленні
          );
          errList.push(...messages);
        }
        setErrorMsg(errList);
      } else {
        setErrorMsg([
          err?.data?.title ||
            err?.data?.message ||
            "An error occurred while updating profile.",
        ]);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
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
      setErrorMsg([
        err?.data?.title || err?.data?.message || "Could not add language.",
      ]);
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

  return (
    <div className="space-y-6 max-w-3xl pb-5">
      {errorMsg.length > 0 && <FormErrorAlert message={errorMsg} />}

      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Floating Save Button */}
        <div
          className={`fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-50 transition-all duration-300 ${
            isDirty
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="bg-surface border border-border rounded-xl p-3 shadow-2xl flex items-center gap-4">
            <span className="text-sm font-medium text-text-main pl-2 hidden sm:inline-block">
              Unsaved changes
            </span>
            <SubmitButton
              form="edit-profile-form"
              isLoading={isUpdating}
              label="Save Profile"
            />
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center gap-5">
              <div className="relative group w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  {avatarPreview || user?.avatarImg ? (
                    <img
                      src={avatarPreview || userImageUrl(user?.avatarImg ?? "")}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold text-4xl">
                      {avatarLetters(user)}
                    </span>
                  )}
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setSelectedAvatar(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                    title="Cancel selection"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
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

          <div className="w-full lg:w-1/2 bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
              Basic Information
            </h2>
            <div className="space-y-5 max-w-xl">
              <FormField id="displayName" label="Display Name">
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. John Doe"
                  className={inputClass}
                />
              </FormField>
              <FormField id="countryId" label="Country" required>
                <Select<SelectOption<number>>
                  inputId="countryId"
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(val) => {
                    setSelectedCountry(val);
                    setIsDirty(true);
                  }}
                  styles={selectStyles}
                  placeholder="Select a country..."
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
            {isFreelancer ? "Freelancer Details" : "Company Details"}
          </h2>
          <div className="space-y-5">
            {isFreelancer ? (
              <>
                <FormField id="bio" label="Bio">
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setIsDirty(true);
                    }}
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
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setIsDirty(true);
                    }}
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
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Acme Corp"
                    className={inputClass}
                  />
                </FormField>
                <FormField id="companyWebsite" label="Company Website">
                  <input
                    id="companyWebsite"
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => {
                      setCompanyWebsite(e.target.value);
                      setIsDirty(true);
                    }}
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
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
              Skills
            </h2>
            <div className="max-w-xl">
              <FormField id="skills" label="Selected Skills">
                <Select
                  isMulti
                  inputId="skills"
                  options={skillOptions}
                  value={selectedSkills}
                  onChange={(newValue) => {
                    setSelectedSkills(newValue);
                    setIsDirty(true);
                  }}
                  styles={selectStyles}
                  placeholder="Select skills..."
                  menuPlacement="auto"
                />
              </FormField>
            </div>
          </div>

          {/* Portfolio Card */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
              Portfolio
            </h2>

            <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-border-light">
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

            <div className="space-y-4 mt-6">
              {freelancer?.portfolio && freelancer.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {freelancer.portfolio.map((item, idx) => {
                    const gradients = [
                      "from-blue-500 to-indigo-500",
                      "from-emerald-400 to-cyan-500",
                      "from-violet-500 to-fuchsia-500",
                      "from-amber-400 to-orange-500",
                      "from-pink-500 to-rose-500",
                    ];
                    const gradient = gradients[idx % gradients.length];
                    const urlStr = item.portfolioUrl?.toLowerCase() || "";
                    const isGithub = urlStr.includes("github.com");
                    const isDribbble = urlStr.includes("dribbble.com");

                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                      >
                        <div
                          className={`pl-4 h-12 w-full bg-gradient-to-br ${gradient} opacity-90 flex items-center justify-start relative`}
                        >
                          <div className="absolute inset-0 bg-black/10"></div>
                          {isGithub ? (
                            <svg
                              className="w-10 h-10 text-white/50 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : isDribbble ? (
                            <svg
                              className="w-10 h-10 text-white/50 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.156-.13-.316-.2-.476-1.328-3.143-2.825-5.992-2.868-6.071l-.019-.033A8.47 8.47 0 0118.605 6.61zM12 3.5c2.316 0 4.417.93 5.948 2.443-.092.164-1.378 2.435-2.73 5.485-3.003-1.285-6.196-1.579-6.398-1.596-.062-.004-.131-.01-.197-.01-.062 0-.127 0-.192.002C8.361 9.426 8.272 9.06 8.169 8.675 6.945 4.103 4.606 1.821 4.545 1.761 6.551 1.018 8.877 1.018 10.883 1.761c.061.06 2.4 2.342 3.624 6.914zM3.5 12c0-1.077.2-2.106.565-3.064.218.156 3.193 2.193 4.428 6.223a31.396 31.396 0 00-4.887 2.115A8.468 8.468 0 013.5 12zm8.5 8.5c-2.072 0-3.97-.74-5.454-1.97.106-.051 2.223-1.01 4.962-1.996 1.353 3.681 1.956 7.155 1.99 7.375C12.983 20.354 12.497 20.5 12 20.5zm6.536-2.505a8.483 8.483 0 01-4.086 2.32c-.08-.544-.658-3.94-1.928-7.513 2.825-.333 5.568.18 5.867.24a8.476 8.476 0 01.147 4.953z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-10 h-10 text-white/50 relative z-10"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-text-main line-clamp-1 pr-6 mb-1 text-base">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-text-muted mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.portfolioUrl && (
                            <a
                              href={item.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-primary hover:underline mt-4 inline-flex items-center gap-1 uppercase tracking-wider"
                            >
                              View Link <ArrowIcon direction="right" />
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolio(item.id)}
                          disabled={isRemovingPortfolio}
                          className="absolute top-3 right-3 p-1.5 text-white/70 hover:text-white bg-black/20 hover:bg-red-500 rounded-lg backdrop-blur-sm transition-colors shadow-sm"
                          title="Remove Portfolio Item"
                        >
                          <DeleteIcon className="w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-text-muted">
                    No portfolio items yet. Add one above!
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
        <h2 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-light">
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
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-border-light"
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
                    <DeleteIcon className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-text-muted">No languages added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
