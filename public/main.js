
  const popup = document.getElementById("popupModal");
  const form = document.getElementById("swapForm");
  const wantedSkillsSelect = document.getElementById("wantedSkillsSelect");

  function openPopup(userId, skillsWantedJson) {
    try {
      document.body.style.overflow = 'hidden';
      const skills = JSON.parse(skillsWantedJson);
      form.action = `/swap-request/${userId}`;
      wantedSkillsSelect.innerHTML = "";

      if (skills.length === 0) {
        wantedSkillsSelect.innerHTML = `<option disabled selected>No skills listed</option>`;
      } else {
        skills.forEach(skill => {
          const option = document.createElement("option");
          option.value = skill;
          option.textContent = skill;
          wantedSkillsSelect.appendChild(option);
        });
      }

      popup.classList.remove("hidden");
    } catch (err) {
      alert("Failed to load skills. Please try again.");
    }
  }

  function closePopup() {
    document.body.style.overflow = 'auto';
    popup.classList.add("hidden");
    form.action = "#";
    wantedSkillsSelect.innerHTML = "";
    form.reset();
  }

  function handleSubmit() {
    closePopup(); 
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });


   
    const searchInput = document.getElementById("searchInput");
    const phrases = [
      "Search for 'Web Development'",
      "Search for 'Photography'",
      "Search for 'Language Exchange'",
      "Search for 'Graphic Design'",
      "Search for 'Public Speaking'"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let currentText = '';
    let isDeleting = false;

    function typePlaceholder() {
      const fullText = phrases[phraseIndex];
      currentText = isDeleting
        ? fullText.substring(0, charIndex--)
        : fullText.substring(0, charIndex++);

      if (!searchInput.value) searchInput.placeholder = currentText;

      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        setTimeout(typePlaceholder, 1800);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typePlaceholder, 500);
      } else {
        setTimeout(typePlaceholder, isDeleting ? 30 : 100);
      }
    }

    typePlaceholder();
  