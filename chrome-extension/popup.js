// Configuration - change this to your production URL when deployed
const API_BASE_URL = 'http://localhost:3000';

let currentTab = null;
let arcs = [];
let selectedArcId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Check login and load arcs
  await loadArcs();
});

async function loadArcs() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resources`, {
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        showLoginRequired();
        return;
      }
      throw new Error('Failed to load arcs');
    }

    const data = await response.json();
    arcs = data.arcs || [];

    if (arcs.length === 0) {
      showNoArcs();
      return;
    }

    // Get last used arc from storage
    const stored = await chrome.storage.local.get('lastArcId');
    selectedArcId = stored.lastArcId || arcs[0].id;

    // Make sure selectedArcId exists in arcs
    if (!arcs.find(a => a.id === selectedArcId)) {
      selectedArcId = arcs[0].id;
    }

    showForm();
  } catch (error) {
    console.error('Load error:', error);
    showError('Arc 목록을 불러오지 못했습니다.');
  }
}

function showLoginRequired() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="login-required">
      <p style="margin-bottom: 16px;">Plynk Arc에 로그인해주세요</p>
      <button class="btn-primary" onclick="openLogin()">로그인하기</button>
    </div>
  `;
}

function showNoArcs() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="login-required">
      <p style="margin-bottom: 16px;">Arc가 없습니다. 먼저 Arc를 생성하세요.</p>
      <button class="btn-primary" onclick="openDashboard()">대시보드 열기</button>
    </div>
  `;
}

function showError(message) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="error">
      <p class="error-text">${message}</p>
      <button class="btn-secondary" style="margin-top: 12px;" onclick="location.reload()">다시 시도</button>
    </div>
  `;
}

function showForm() {
  const selectedArc = arcs.find(a => a.id === selectedArcId);
  const content = document.getElementById('content');

  content.innerHTML = `
    <div class="form-group">
      <label>URL</label>
      <div class="url-preview">${currentTab?.url || ''}</div>
    </div>

    <div class="form-group">
      <label>Arc 선택</label>
      <div class="select-wrapper">
        <div class="arc-select" id="arcSelect">
          <span class="icon">${selectedArc?.icon || ''}</span>
          <span class="name">${selectedArc?.name || 'Arc 선택'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
        <div class="arc-dropdown" id="arcDropdown" style="display: none;">
          ${arcs.map(arc => `
            <div class="arc-option ${arc.id === selectedArcId ? 'selected' : ''}" data-id="${arc.id}">
              <span class="icon">${arc.icon}</span>
              <span class="name">${arc.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>제목 (선택사항)</label>
      <input type="text" id="customTitle" placeholder="${currentTab?.title || '비워두면 자동 추출됩니다'}">
    </div>

    <div class="buttons">
      <button class="btn-secondary" onclick="window.close()">취소</button>
      <button class="btn-primary" id="saveBtn" onclick="saveResource()">저장하기</button>
    </div>
  `;

  // Arc dropdown toggle
  const arcSelect = document.getElementById('arcSelect');
  const arcDropdown = document.getElementById('arcDropdown');

  arcSelect.addEventListener('click', () => {
    arcDropdown.style.display = arcDropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Arc selection
  document.querySelectorAll('.arc-option').forEach(option => {
    option.addEventListener('click', () => {
      selectedArcId = option.dataset.id;
      chrome.storage.local.set({ lastArcId: selectedArcId });
      showForm(); // Re-render
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.select-wrapper')) {
      arcDropdown.style.display = 'none';
    }
  });
}

async function saveResource() {
  const saveBtn = document.getElementById('saveBtn');
  const customTitle = document.getElementById('customTitle')?.value?.trim();

  saveBtn.disabled = true;
  saveBtn.textContent = '저장 중...';

  try {
    const response = await fetch(`${API_BASE_URL}/api/resources`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        arcId: selectedArcId,
        url: currentTab.url,
        customTitle: customTitle || undefined
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '저장에 실패했습니다.');
    }

    showSuccess();
  } catch (error) {
    console.error('Save error:', error);
    showError(error.message || '저장에 실패했습니다.');
  }
}

function showSuccess() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="success">
      <div class="success-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <p style="font-weight: 500; margin-bottom: 4px;">저장 완료!</p>
      <p style="font-size: 13px; color: #6b7280;">리소스가 Arc에 저장되었습니다.</p>
    </div>
  `;

  // Auto close after 1.5 seconds
  setTimeout(() => window.close(), 1500);
}

function openLogin() {
  chrome.tabs.create({ url: `${API_BASE_URL}/login` });
  window.close();
}

function openDashboard() {
  chrome.tabs.create({ url: `${API_BASE_URL}/dashboard` });
  window.close();
}
