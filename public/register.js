
    const skillsOffered = [], skillsWanted = [];

    const offeredInput = document.getElementById('skillsOfferedInput');
    const offeredContainer = document.getElementById('skillsOfferedContainer');
    const offeredHidden = document.getElementById('skillsOfferedHidden');

    const wantedInput = document.getElementById('skillsWantedInput');
    const wantedContainer = document.getElementById('skillsWantedContainer');
    const wantedHidden = document.getElementById('skillsWantedHidden');

    function addSkill(skill, list, container) {
      if (!skill || list.includes(skill)) return;
      list.push(skill);

      const tag = document.createElement('div');
      tag.className = 'bg-white text-black px-3 py-1 rounded-full flex items-center text-sm  ';
      tag.innerHTML = `
        <span>${skill}</span>
        <button type="button" class="ml-2 text-black hover:text-red-400" onclick="removeSkill('${skill}', '${container.id}')">✕</button>
      `;
      tag.dataset.value = skill;
      container.appendChild(tag);
    }

    function removeSkill(skill, containerId) {
      const container = document.getElementById(containerId);
      const list = containerId === 'skillsOfferedContainer' ? skillsOffered : skillsWanted;

      const index = list.indexOf(skill);
      if (index > -1) list.splice(index, 1);

      const tag = [...container.children].find(tag => tag.dataset.value === skill);
      if (tag) container.removeChild(tag);
    }

    function syncSkills() {
      offeredHidden.value = skillsOffered.join(',');
      wantedHidden.value = skillsWanted.join(',');
      return true;
    }

    offeredInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const skill = offeredInput.value.trim();
        addSkill(skill, skillsOffered, offeredContainer);
        offeredInput.value = '';
      }
    });

    wantedInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const skill = wantedInput.value.trim();
        addSkill(skill, skillsWanted, wantedContainer);
        wantedInput.value = '';
      }
    });



