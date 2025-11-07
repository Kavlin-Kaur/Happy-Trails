# Contributing to Happy-Trails 🚌# Contributing to Happy-Trails 🚌## How to Contribute



Thank you for your interest in contributing to Happy-Trails! Whether you're a seasoned developer or making your first open-source contribution, this guide will help you get started. 



**This project is perfect for beginners!** We're excited to help new contributors learn and grow. 💚Thank you for your interest in contributing to Happy-Trails! This document provides comprehensive guidelines to help you get started and make meaningful contributions to our project.- Firstly, Star⭐ The Repository...



## Table of Contents- Take a look at the Existing [Issues] or create your own...

- [What is Happy-Trails?](#what-is-happy-trails)

- [Getting Started](#getting-started)## Table of Contents- Fork the Repo and create a Branch for any Issue that you are working upon.

- [First-Time Contributors](#first-time-contributors)

- [Local Setup Guide](#local-setup-guide)- [Getting Started](#getting-started)- Create a Pull Request which will be promptly reviewed and suggestions would be added to improve it.

- [Understanding the Project Structure](#understanding-the-project-structure)

- [Types of Contributions](#types-of-contributions)- [Local Setup Guide](#local-setup-guide)- Add Screenshots to help us know what this is all about.

- [Branch Naming Conventions](#branch-naming-conventions)

- [Making Changes](#making-changes)- [Branch Naming Conventions](#branch-naming-conventions)

- [Submitting a Pull Request](#submitting-a-pull-request)

- [Pull Request Guidelines](#pull-request-guidelines)- [Making Changes](#making-changes)## How to make a Pull Request

- [Troubleshooting](#troubleshooting)

- [Resources](#resources)- [Submitting a Pull Request](#submitting-a-pull-request)



---- [Pull Request Guidelines](#pull-request-guidelines)**1.** Fork the repository by clicking on the Fork symbol at the top right corner.



## What is Happy-Trails? - [Resources](#resources)



**Happy-Trails** is a poetic, modern bus booking platform built with **Python (Flask)** and interactive **JavaScript**. **2.** Clone the forked repository.



### Key Features:---```

- 🎫 Real-time bus search and booking

- 💺 Interactive graphical seat selection   git clone https://github.com/YOUR_USERNAME/Happy-Trails.git

- 🗺️ Live bus tracking with Leaflet.js maps

- 🎨 Beautiful UI with glass morphism and smooth animations## Getting Started```

- 🔐 Secure user authentication & password strength validation

- ⛅ Weather integration (OpenWeatherMap API)

- 🌙 Modern, cosmic-themed design with poetic copy

### Prerequisites**3.** Navigate to the project directory.

### What You'll Learn:

Working on Happy-Trails, you'll gain experience with:```

- **Backend**: Flask, Flask-SQLAlchemy, Flask-Login, session management

- **Frontend**: HTML5, CSS3 (glass morphism, gradients), Vanilla JavaScriptBefore you begin, ensure you have the following installed:   cd Happy-Trails

- **Database**: SQLite (development) / PostgreSQL (production)

- **APIs**: Integrating third-party services (Google Maps, OpenWeatherMap)- **Git** - [Download Git](https://git-scm.com/)```

- **Git & GitHub**: Version control, pull requests, collaboration

- **UX/UI**: Creating beautiful, user-centered interfaces- **Python 3.8+** - [Download Python](https://www.python.org/)



---- **pip** - Usually comes with Python**4.** Create a new branch:



## Getting Started- **Code Editor** - VSCode recommended, but any editor works```



### ❓ New to Open Source?   git checkout -b YourBranchName



Don't worry! Here's what key terms mean:### Quick Start Checklist```



| Term | Meaning | What It Does |

|------|---------|------------|

| **Fork** | Create your own copy of the entire project | You get your own version to experiment with |- ⭐ Star the repository (shows your support!)**5.** Make changes in source code.

| **Clone** | Download the fork to your computer | Creates a folder with all project files locally |

| **Branch** | Create a separate "workspace" for your changes | Keeps your work organized and doesn't break the main code |- 🔍 Review existing [Issues](https://github.com/Kavlin-Kaur/Happy-Trails/issues) before starting

| **Commit** | Save changes with a description | Creates a checkpoint with a message explaining what changed |

| **Push** | Upload your commits to GitHub | Sends your local changes to your fork on GitHub |- 🍴 Fork the repository**6.** Stage your changes and commit

| **Pull Request (PR)** | Ask project owners to merge your changes | They review and approve your changes |

- 🔧 Set up your local environment

[📖 Full GitHub Workflow Guide](https://guides.github.com/introduction/flow/)

- 📝 Create a branch for your work```

### Prerequisites

- 💾 Make your changes   git add .

Before you begin, install these tools:

- 📤 Submit a Pull Request   git commit -m "<your_commit_message>"

1. **Git** (2.0+)

   - [Download Git](https://git-scm.com/)```

   - [Git Tutorial for Complete Beginners (10 min video)](https://www.youtube.com/watch?v=RGOj5yH7evk)

   - Verify: Open terminal/CMD and type `git --version`---



2. **Python** (3.8 or higher)**7.** Push your local commits to the remote repo.

   - [Download Python](https://www.python.org/)

   - ⚠️ **Important**: Check "Add Python to PATH" during installation## Local Setup Guide

   - Verify: Open terminal/CMD and type `python --version`

```

3. **Code Editor**

   - [VS Code](https://code.visualstudio.com/) (Recommended - beginner-friendly, built-in terminal)### Step 1: Fork the Repository   git push origin YourBranchName

   - Or any editor you're comfortable with (PyCharm, Sublime, etc.)

```

### Quick Start Checklist

1. Click the **Fork** button in the top-right corner of the [repository](https://github.com/Kavlin-Kaur/Happy-Trails)

- ⭐ **Star the repository** (shows your support!)

- 🔍 **Review existing [Issues](https://github.com/Kavlin-Kaur/Happy-Trails/issues)** - Pick one to work on or create a new one2. This creates a copy of the repository under your GitHub account**8.** Create a [PR](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)

- 🍴 **Fork the repository** - Creates your own copy

- 🔧 **Set up your local environment** - Follow the guide below

- 📝 **Create a branch** - For your specific work

- 💾 **Make your changes** - Code your contribution### Step 2: Clone Your Fork**Note** If anyone contributes to this repository, then the changes will not be reflected in your local repository. For that:

- 📤 **Submit a Pull Request** - Ask to merge your changes



---

Open your terminal and run:**9.** Setup a reference(remote) to the original repository to get all the changes from the remote.

## First-Time Contributors

```

### Looking for Easy Tasks?

```bash   git remote add upstream https://github.com/Kavlin-Kaur/Happy-Trails.git

Start with these types of issues (usually marked with `good first issue` label):

- 🐛 **Bug Fixes**: Found a typo or small bug? Fix it!git clone https://github.com/YOUR_USERNAME/Happy-Trails.git```

- 📝 **Documentation**: Improve README, comments, or guides like this

- 🎨 **UI/UX**: Small styling improvements or accessibility fixescd Happy-Trails

- ✅ **Tests**: Add test coverage for existing features

- 🔍 **Code Review**: Review and suggest improvements on existing PRs```**10.** Check the remotes for this repository.



### Your First Contribution Steps:```



1. **Pick an issue** from the [Issues page](https://github.com/Kavlin-Kaur/Happy-Trails/issues)Replace `YOUR_USERNAME` with your actual GitHub username.   git remote -v

2. **Comment on the issue** to let others know you're working on it

3. **Follow the setup guide** below to get the project running locally```

4. **Make your changes** on a new branch

5. **Test locally** to ensure it works### Step 3: Add Upstream Remote

6. **Create a Pull Request** with a clear description

7. **Respond to feedback** from the maintainers**11.** Fetching from the remote repository will bring in its branches and their respective commits.



### Don't Know Where to Start?To keep your fork synchronized with the original repository:```



- 📞 Ask in the [Discussions](https://github.com/Kavlin-Kaur/Happy-Trails/discussions) section   git fetch upstream

- 💬 Comment on issues with questions

- 🤝 We're here to help - no question is too beginner-level!```bash```



---git remote add upstream https://github.com/Kavlin-Kaur/Happy-Trails.git



## Local Setup Guide```**12.** Make sure that you're on your main branch.



### Step 1: Fork the Repository```



1. Go to [Happy-Trails Repository](https://github.com/Kavlin-Kaur/Happy-Trails)Verify your remotes:   git checkout main

2. Click the **Fork** button (top-right corner)

3. Select where to fork (usually your personal account)```bash```

4. You now have your own copy at `github.com/YOUR_USERNAME/Happy-Trails`

git remote -v

**What just happened?** You created a copy of the project under your account that you can freely modify.

```**13.** Now that we have fetched the upstream repository, we want to merge its changes into our local branch. This will bring that branch into sync with the upstream, without losing our local changes.

### Step 2: Clone Your Fork to Your Computer

```

Open your terminal/command prompt and run:

You should see:   git merge upstream/main

```bash

git clone https://github.com/YOUR_USERNAME/Happy-Trails.git- `origin` → Your fork```

cd Happy-Trails

```- `upstream` → Original repository



Replace `YOUR_USERNAME` with your actual GitHub username.Here are a few things you can do that will increase the likelihood of your pull request being accepted:



**What just happened?** You've downloaded the project files to your computer into a folder called `Happy-Trails`.### Step 4: Set Up Python Environment



### Step 3: Add Upstream Remote (To Stay Updated)- Follow the [style guide](https://gist.github.com/lisawolderiksen/a7b99d94c92c6671181611be1641c733). Any linting errors should be shown when running `npm test`.



```bash**Create a virtual environment:**- Write and update tests.

git remote add upstream https://github.com/Kavlin-Kaur/Happy-Trails.git

```- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.



Verify your remotes:```bash- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

```bash

git remote -v# On Windows

```

python -m venv venv## Resources 

**Expected output:**

```venv\Scripts\activate

origin    https://github.com/YOUR_USERNAME/Happy-Trails.git (fetch)

origin    https://github.com/YOUR_USERNAME/Happy-Trails.git (push)- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

upstream  https://github.com/Kavlin-Kaur/Happy-Trails.git (fetch)

upstream  https://github.com/Kavlin-Kaur/Happy-Trails.git (push)# On macOS/Linux- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)

```

python3 -m venv venv- [GitHub Help](https://help.github.com)

**What just happened?** You've set up two remotes:source venv/bin/activate

- `origin` = Your fork (you can push here)```

- `upstream` = Original repo (you pull updates from here)

**Install dependencies:**

### Step 4: Set Up Python Virtual Environment

```bash

A **virtual environment** is a separate Python workspace for this project. It prevents conflicts with other Python projects on your computer.pip install -r requirements.txt

```

**On Windows:**

```bash### Step 5: Configure Environment Variables

python -m venv venv

venv\Scripts\activateCreate a `.env` file in the project root directory:

```

```bash

**On macOS/Linux:**cp .env.example .env  # If example exists, otherwise create manually

```bash```

python3 -m venv venv

source venv/bin/activate**Add the following variables to `.env`:**

```

```

**You'll know it worked when** you see `(venv)` before your terminal prompt.FLASK_ENV=development

FLASK_DEBUG=True

**To deactivate later:** Just type `deactivate`SECRET_KEY=your_secret_key_here

DATABASE_URL=sqlite:///instance/happytrails.db

### Step 5: Install Project Dependencies```



```bash**Need API keys or credentials?**

pip install -r requirements.txt

```Follow the steps below to obtain the necessary API keys:



This installs all the Python packages the project needs (Flask, SQLAlchemy, etc.)1. **Google Maps API Key**

   - Visit [Google Cloud Console](https://console.cloud.google.com/)

**Expected output:** Should show "Successfully installed..." messages   - Create a new project

   - Enable the Maps JavaScript API and Geocoding API

### Step 6: Configure Environment Variables   - Generate an API key from the Credentials section

   - Add to `.env`: `GOOGLE_MAPS_API_KEY=your_key_here`

Create a `.env` file in the project root (same folder as `app.py`):

2. **Email Service (Optional)**

```bash   - For email notifications, you can use Gmail or SendGrid

# Windows   - Visit [SendGrid](https://sendgrid.com/) for API key

copy .env.example .env   - Or enable 2FA on Gmail and [generate an app password](https://myaccount.google.com/apppasswords)

   - Add to `.env`: `EMAIL_API_KEY=your_key_here`

# macOS/Linux

cp .env.example .env3. **Other Keys**

```   - For additional APIs needed for development, please open an issue or contact the maintainers

   - They will provide test credentials or guidance

**If `.env.example` doesn't exist, create `.env` manually:**

**Important Security Notes:**

Add these lines to `.env`:- 🔒 Do NOT commit `.env` file (it's already in `.gitignore`)

- 🔐 Never share your API keys publicly

```- 📝 If you need to add new keys, update this section in `CONTRIBUTING.md`

FLASK_ENV=development- 💬 For production credentials, contact the project maintainers

FLASK_DEBUG=True

SECRET_KEY=your_super_secret_key_12345### Step 6: Initialize the Database

DATABASE_URL=sqlite:///instance/happytrails.db

``````bash

python

### Step 7: Get API Keys (If Needed)>>> from app import db

>>> db.create_all()

Depending on which feature you're working on, you may need API keys:>>> exit()

```

#### 🗺️ **Google Maps API Key** (For maps/tracking features)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)### Step 7: Run the Application

2. Create a new project

3. Search for "Maps JavaScript API" and enable it```bash

4. Search for "Geocoding API" and enable itpython app.py

5. Go to **Credentials** → **Create Credentials** → **API Key**```

6. Copy the key and add to `.env`:

   ```Visit `http://localhost:5000` in your browser to see the app running.

   GOOGLE_MAPS_API_KEY=your_api_key_here

   ```---



#### ⛅ **OpenWeatherMap API Key** (For weather display)## Branch Naming Conventions

1. Go to [OpenWeatherMap](https://openweathermap.org/api)

2. Sign up for a free accountUse clear, descriptive branch names that follow this format:

3. Go to **API keys** in your account

4. Copy the default key and add to `.env`:```

   ```<type>/<issue-number>-<short-description>

   OPENWEATHERMAP_API_KEY=your_api_key_here```

   ```

### Examples:

#### 📧 **Email Service** (Optional, for email features)

- **Option A**: Gmail- `feature/49-enhance-contributing-docs` - New feature

  - Enable 2FA on your Gmail account- `fix/35-login-bug` - Bug fix

  - [Generate an app password](https://myaccount.google.com/apppasswords)- `docs/22-update-readme` - Documentation

  - Add to `.env`: `EMAIL_PASSWORD=your_app_password`- `refactor/18-cleanup-code` - Code refactoring



- **Option B**: SendGrid### Branch Types:

  - Sign up at [SendGrid](https://sendgrid.com/)

  - Get your API key from the dashboard| Type | Purpose |

  - Add to `.env`: `SENDGRID_API_KEY=your_key_here`|------|---------|

| `feature/` | New features or enhancements |

**⚠️ Security Reminder:**| `fix/` | Bug fixes |

- Never commit `.env` to Git (it's in `.gitignore`)| `docs/` | Documentation updates |

- Never share your API keys publicly| `refactor/` | Code refactoring without changing functionality |

- If you accidentally commit sensitive info, ask maintainers for help| `test/` | Adding or updating tests |



### Step 8: Initialize Database---



```bash## Making Changes

python

>>> from app import db### Step 1: Create a Branch

>>> db.create_all()

>>> exit()```bash

```git checkout -b feature/issue-number-description

```

This creates the database tables. You should see files created in the `instance/` folder.

Example:

### Step 9: Run the Application```bash

git checkout -b feature/49-enhance-contributing-docs

```bash```

python app.py

```### Step 2: Make Your Changes



**Expected output:**- Keep commits small and focused

```- One feature or fix per branch

 * Serving Flask app 'app'- Write clear, descriptive commit messages

 * Debug mode: on

 * Running on http://127.0.0.1:5000### Step 3: Stage and Commit

```

```bash

Open your browser and go to `http://localhost:5000` 🎉# Stage specific files

git add path/to/file

You should see the Happy-Trails homepage with the cosmic theme!

# Or stage all changes

**To stop the server:** Press `Ctrl + C` in your terminalgit add .



---# Commit with a clear message

git commit -m "Add local setup guide to CONTRIBUTING.md"

## Understanding the Project Structure```



Here's what each folder contains:**Good commit message format:**

```

```<type>: <subject> (#issue-number)

Happy-Trails/

├── app.py                 # Main Flask application<optional body with more details>

├── requirements.txt       # Python dependencies```

├── .env                   # Environment variables (DON'T commit this)

├── .gitignore            # Files to ignore in GitExample:

├── instance/             # Database files (created automatically)```

│   └── happytrails.dbdocs: enhance CONTRIBUTING.md with setup guide (#49)

├── static/               # Static files (images, CSS, JS)

│   ├── css/- Added detailed local setup steps

│   │   └── main.css      # Styling (glass morphism, gradients)- Included environment variable configuration

│   ├── js/- Improved branch naming conventions

│   │   └── main.js       # JavaScript for interactions```

│   └── images/           # Destination images, logos

├── templates/            # HTML pages (Jinja2 templates)---

│   ├── base.html         # Base template (shared layout)

│   ├── index.html        # Homepage## Submitting a Pull Request

│   ├── login.html        # Login page

│   ├── signup.html       # Signup page### Step 1: Sync with Upstream

│   ├── book_bus.html     # Search buses

│   ├── select_bus.html   # View bus resultsBefore pushing, ensure your branch has the latest changes:

│   ├── select_seats.html # Interactive seat selection

│   ├── payment.html      # Payment confirmation```bash

│   ├── my_bookings.html  # User's bookings# Fetch latest changes from original repo

│   └── track_bus.html    # Live bus trackinggit fetch upstream

└── README.md             # Project documentation

```# Rebase your branch on top of upstream/master

git rebase upstream/master

### Quick Tips:```

- 🐍 **Backend changes?** Modify `app.py` and test in browser

- 🎨 **Style changes?** Edit `static/css/main.css`If conflicts occur, resolve them and continue:

- ⚡ **Interactive features?** Modify `static/js/main.js````bash

- 📄 **Page changes?** Edit files in `templates/` foldergit add .

git rebase --continue

---```



## Types of Contributions### Step 2: Push to Your Fork



### 1. 🐛 Bug Fixes```bash

**Fix broken features or unexpected behavior**git push origin feature/issue-number-description

```

Example issues:

- "Login button doesn't work on mobile"### Step 3: Create a Pull Request

- "Typo on homepage"

- "Seat selection has a display bug"1. Go to the original [Happy-Trails repository](https://github.com/Kavlin-Kaur/Happy-Trails)

2. Click the **"Compare & pull request"** button

### 2. ✨ New Features3. Ensure:

**Add new functionality to the app**   - Base branch is `master` (or `main`)

   - Compare branch is your feature branch

Example features:4. Fill in the PR template with:

- "Add password reset via email"   - Clear title (reference the issue number)

- "Show estimated arrival time for buses"   - Description of changes

- "Save favorite routes"   - Screenshots (if applicable)

5. Click **"Create pull request"**

### 3. 📝 Documentation

**Improve guides, comments, and explanations**---



Example improvements:## Pull Request Guidelines

- Clarify setup instructions (like this file!)

- Add code comments for complex functionsTo increase the chances of your PR being accepted:

- Create tutorials or FAQs

✅ **Do:**

### 4. 🎨 UI/UX Improvements- Write clear, descriptive commit messages

**Enhance the user interface and experience**- Keep PRs focused on a single issue or feature

- Include screenshots/GIFs for UI changes

Example improvements:- Reference the related issue (#49)

- Better mobile responsiveness- Update documentation if needed

- Improved color scheme or animations- Test your changes locally

- Clearer icons or buttons- Follow existing code style and conventions

- Accessibility improvements (for users with disabilities)

❌ **Don't:**

### 5. ⚡ Performance- Submit multiple unrelated changes in one PR

**Make the app faster or more efficient**- Include debug code or console.log statements

- Commit sensitive information (.env, secrets)

Example improvements:- Force push to shared branches

- Optimize database queries- Leave merge conflicts unresolved

- Reduce JavaScript bundle size

- Cache frequently-accessed data### PR Title Format



### 6. ✅ Tests```

**Add tests to catch bugs automatically**[TYPE] Brief description (closes #issue-number)

```

Example tests:

- Test user registration flowExamples:

- Test seat selection logic- `[FEATURE] Add email verification (closes #49)`

- Test payment calculation- `[FIX] Resolve login timeout issue (closes #35)`

- `[DOCS] Update CONTRIBUTING.md (closes #49)`

---

---

## Branch Naming Conventions

## Keeping Your Fork Updated

Use clear, descriptive branch names that follow this format:

### Sync Before Starting New Work

```

<type>/<issue-number>-<short-description>```bash

```# Switch to master branch

git checkout master

### Examples:

# Fetch latest changes

- `feature/49-enhance-contributing-docs` - Adding/improving a featuregit fetch upstream

- `fix/35-login-bug` - Bug fix

- `docs/22-update-readme` - Documentation update# Update your local master

- `refactor/18-cleanup-code` - Code cleanupgit merge upstream/master

- `ui/51-mobile-responsiveness` - UI improvement

# Push to your fork

### Branch Types:git push origin master

```

| Type | Purpose | Example |

|------|---------|---------|### Update Your Current Branch

| `feature/` | New features or enhancements | `feature/add-email-verification` |

| `fix/` | Bug fixes | `fix/seat-selection-crash` |If the master branch has changed while you're working:

| `docs/` | Documentation updates | `docs/setup-guide` |

| `refactor/` | Code cleanup (no functional changes) | `refactor/remove-unused-code` |```bash

| `ui/` | UI/UX improvements | `ui/improve-buttons` |git fetch upstream

| `test/` | Adding/updating tests | `test/add-login-tests` |git rebase upstream/master

```

---

---

## Making Changes

## Common Git Commands

### Step 1: Create a Branch

| Command | Purpose |

Always create a new branch before making changes. Never work directly on `master`!|---------|---------|

| `git status` | Check working directory status |

```bash| `git diff` | View changes before staging |

git checkout -b feature/issue-number-description| `git log --oneline -5` | View last 5 commits |

```| `git branch -a` | List all branches |

| `git checkout -b branch-name` | Create and switch to new branch |

Example:| `git stash` | Save changes temporarily |

```bash| `git stash pop` | Restore stashed changes |

git checkout -b feature/49-enhance-contributing-docs

```---



**Verify you're on the right branch:**## Code Style Guidelines

```bash

git branch- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code

```- Write meaningful variable and function names

- Add comments for complex logic

You should see your new branch marked with `*`.- Keep functions small and focused

- Write tests for new features

### Step 2: Make Your Changes

---

Make your code changes. You can:

- Edit existing files## Resources

- Create new files

- Delete files (if needed)- 📖 [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

- 🔗 [GitHub Help - About Pull Requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)

**Test as you go!** Run `python app.py` and test in your browser.- 📚 [Git Documentation](https://git-scm.com/doc)

- 🐛 [Issue Tracker](https://github.com/Kavlin-Kaur/Happy-Trails/issues)

### Step 3: Check What Changed- 💬 [Discussion Forum](https://github.com/Kavlin-Kaur/Happy-Trails/discussions)



Before committing, see what you've modified:---



```bash## Getting Help

git status

```- 💡 Have questions? Open a [Discussion](https://github.com/Kavlin-Kaur/Happy-Trails/discussions)

- 🐛 Found a bug? [Report it here](https://github.com/Kavlin-Kaur/Happy-Trails/issues/new)

You'll see:- 💬 Join our community and ask on GitHub Issues

- **Red files** = Not yet staged (not ready to commit)

- **Green files** = Staged (ready to commit)---



View the actual changes:## Code of Conduct

```bash

git diffPlease read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and be respectful to all contributors.

```

---

### Step 4: Stage Your Changes

**Happy Contributing! 🎉**

Add the files you want to commit:

```bash
# Add a specific file
git add path/to/file.py

# Add all changes
git add .
```

### Step 5: Write a Good Commit Message

Commit your changes with a clear message:

```bash
git commit -m "Your clear, descriptive message"
```

**Good commit message format:**
```
<type>: <subject> (#issue-number)

<optional body explaining why>
```

**Examples:**

```
docs: enhance CONTRIBUTING.md with setup guide (#49)

- Added detailed setup steps for beginners
- Included API key configuration instructions
- Added project structure explanation
```

```
fix: resolve seat selection bug (#35)

The seat selection was not updating price correctly. 
Fixed by updating the calculateTotal() function to 
recalculate on each seat click.
```

**Good commit message tips:**
- ✅ Be specific and clear
- ✅ Use present tense ("Add" not "Added")
- ✅ Explain *why* if it's not obvious
- ❌ Avoid: "fixed stuff", "update", "changes"

View your commit:
```bash
git log --oneline -5
```

---

## Submitting a Pull Request

### Step 1: Push Your Branch to GitHub

```bash
git push origin your-branch-name
```

Example:
```bash
git push origin feature/49-enhance-contributing-docs
```

**First push?** Git might ask you to set the upstream. Just copy-paste the command it suggests.

### Step 2: Go to GitHub and Create a Pull Request

1. Go to the [Happy-Trails repository](https://github.com/Kavlin-Kaur/Happy-Trails)
2. You should see a **"Compare & pull request"** button (usually appears after you push)
3. Click it!

If you don't see the button:
1. Click on the **"Pull requests"** tab
2. Click **"New pull request"**
3. Select:
   - **Base repository**: `Kavlin-Kaur/Happy-Trails` (original)
   - **Base branch**: `master` (where changes will go)
   - **Head repository**: `YOUR_USERNAME/Happy-Trails` (your fork)
   - **Compare branch**: Your feature branch name

### Step 3: Fill in the Pull Request Details

**Title Format:**
```
[TYPE] Brief description (closes #issue-number)
```

**Examples:**
- `[DOCS] Enhance CONTRIBUTING.md with beginner guide (closes #49)`
- `[FIX] Resolve seat selection bug (closes #35)`
- `[FEATURE] Add email password reset (closes #52)`

**Description Template:**

```markdown
## Description
Brief explanation of what changes you made and why.

## Related Issue
Closes #49

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] UI/UX improvement

## How to Test
Steps to verify your changes work:
1. Go to localhost:5000
2. Click on booking
3. Verify seats display correctly

## Screenshots (if applicable)
Add before/after screenshots here

## Checklist
- [ ] My changes follow the code style of this project
- [ ] I have tested my changes locally
- [ ] I have updated documentation if needed
- [ ] I have not added any hardcoded credentials or secrets
```

### Step 4: Review and Respond to Feedback

Maintainers will review your PR. They may:
- ✅ Approve and merge it
- 💬 Ask questions or request changes
- 🤔 Suggest improvements

**Don't worry if changes are requested!** This is normal and helps improve code quality.

**To make requested changes:**
1. Make edits to your files locally
2. `git add .`
3. `git commit -m "Address review feedback"`
4. `git push origin your-branch-name`
5. The PR automatically updates!

---

## Pull Request Guidelines

### ✅ Do:
- Write clear, descriptive commit messages
- Keep PRs focused on ONE issue or feature
- Include screenshots/GIFs for UI changes
- Test your changes locally before submitting
- Reference the related issue (`Closes #49`)
- Update documentation if you changed functionality
- Be respectful and respond to feedback promptly
- Ask questions if something is unclear!

### ❌ Don't:
- Submit multiple unrelated changes in one PR
- Include debug code, console.log, or comments
- Commit sensitive info (.env files, API keys, passwords)
- Force push to your branch (unless absolutely necessary)
- Leave merge conflicts unresolved
- Make changes to unrelated files
- Rush through the review process

---

## Troubleshooting

### "fatal: not a git repository"
- Make sure you're in the `Happy-Trails` folder
- Try: `cd Happy-Trails`

### "Permission denied" on pip
- Make sure your virtual environment is activated
- Should see `(venv)` before your terminal prompt
- Activate: `source venv/bin/activate` (macOS/Linux) or `venv\Scripts\activate` (Windows)

### "ModuleNotFoundError: No module named 'flask'"
- Virtual environment not activated
- Or dependencies not installed: `pip install -r requirements.txt`

### Port 5000 already in use
- Another app is using the same port
- Try: `python app.py` on a different port: `python -c "import app; app.app.run(port=5001)"`
- Or close the app using port 5000

### Changes not showing in browser
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Stop Flask server (`Ctrl + C`) and restart it
- Clear browser cache if needed

### Git conflicts
- This happens when two changes conflict
- GitHub will show the conflicting sections marked with `<<<<<<` and `>>>>>>`
- Edit to keep what you want, remove conflict markers
- Then `git add .` and `git commit -m "Resolve conflicts"`

### Still stuck?
- 💬 Ask on [Discussions](https://github.com/Kavlin-Kaur/Happy-Trails/discussions)
- 📞 Comment on your PR for help
- 🤝 We're here to help!

---

## Common Git Commands Reference

| Command | What It Does | Example |
|---------|-------------|---------|
| `git status` | Show current branch and changes | `git status` |
| `git log --oneline` | Show recent commits | `git log --oneline -5` |
| `git diff` | Show what changed in files | `git diff` |
| `git branch -a` | List all branches | `git branch -a` |
| `git checkout -b branch-name` | Create and switch to new branch | `git checkout -b feature/my-feature` |
| `git checkout branch-name` | Switch to existing branch | `git checkout master` |
| `git add .` | Stage all changes | `git add .` |
| `git commit -m "msg"` | Commit with message | `git commit -m "fix: bug"` |
| `git push` | Upload commits to GitHub | `git push origin feature/my-feature` |
| `git pull` | Download updates from GitHub | `git pull upstream master` |
| `git stash` | Temporarily save changes | `git stash` |
| `git stash pop` | Restore stashed changes | `git stash pop` |
| `git fetch upstream` | Get updates from original repo | `git fetch upstream` |
| `git rebase upstream/master` | Rebase on latest original repo | `git rebase upstream/master` |

---

## Code Style Guidelines

### Python (Backend)
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use meaningful variable names: `user_email` not `ue`
- Add docstrings to functions:
  ```python
  def book_bus(bus_id, user_id):
      """Book a bus for the user. Returns booking ID or None."""
      pass
  ```
- Keep functions small and focused (one job per function)
- Add comments for complex logic

### JavaScript
- Use meaningful variable names
- Use `const` by default, `let` if needed, avoid `var`
- Add comments for complex logic
- Keep functions small

### HTML/CSS
- Use semantic HTML (`<section>`, `<article>`, not just `<div>`)
- Use descriptive class names
- Comment complex CSS sections
- Ensure mobile responsiveness

---

## Keeping Your Fork Updated

### Before Starting New Work

Keep your fork in sync with the original repo:

```bash
# Switch to master branch
git checkout master

# Fetch latest changes from original repo
git fetch upstream

# Update your local master with original
git merge upstream/master

# Push the updates to your fork
git push origin master
```

### Update Your Current Branch

If you're working on a feature and master was updated:

```bash
git fetch upstream
git rebase upstream/master
```

If conflicts occur:
1. Fix the conflicts in the conflicting files
2. `git add .`
3. `git rebase --continue`

---

## Resources & Learning Materials

### Git & GitHub
- 📖 [GitHub's Git Handbook](https://guides.github.com/) - Official tutorial
- 🎥 [Git & GitHub Crash Course (30 min video)](https://www.youtube.com/watch?v=RGOj5yH7evk)
- 🎓 [Interactive Git Learning](https://learngitbranching.js.org/) - Visual, hands-on

### Open Source
- 📖 [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- 🤝 [First Timers Only](https://www.firsttimersonly.com/) - Guide for first-time contributors
- 💡 [Open Source Tips & Tricks](https://contribution.first-timers.dev/)

### Python & Flask
- 🐍 [Python Official Documentation](https://docs.python.org/)
- 🚀 [Flask Official Tutorial](https://flask.palletsprojects.com/)
- 📚 [Real Python Tutorials](https://realpython.com/)

### Frontend
- 🎨 [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JavaScript reference
- 💅 [CSS Tricks](https://css-tricks.com/) - Advanced CSS techniques
- ⚡ [JavaScript Info](https://javascript.info/) - Deep dive into JavaScript

### Bus Booking Platforms
- Check out similar projects to understand domain knowledge
- Study the UX of platforms like Redbus, 12Go

---

## Getting Help

- 💡 **Questions?** Open a [Discussion](https://github.com/Kavlin-Kaur/Happy-Trails/discussions)
- 🐛 **Found a bug?** [Report it here](https://github.com/Kavlin-Kaur/Happy-Trails/issues/new)
- 💬 **Need help?** Comment on the issue you're working on
- 🤝 **Want to chat?** Reach out to maintainers directly
- 📢 **Idea for a feature?** Create an issue to discuss it first

---

## Code of Conduct

Please read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and be respectful to all contributors. We're building an inclusive, welcoming community! 💚

---

## Celebrating Your Contribution

Once your PR is merged:
- 🎉 Your changes go live to the world!
- ⭐ You'll be listed as a contributor on GitHub
- 💬 We'll thank you and celebrate your work
- 🚀 You've made open-source history!

---

**Happy Contributing! 🚌✨**

*Have suggestions for improving this guide? We'd love your feedback! Open an issue or PR.*

---

## Quick Links
- 🏠 [GitHub Repository](https://github.com/Kavlin-Kaur/Happy-Trails)
- 🚀 [Live Demo](https://HappyTrails.vercel.app/)
- 📋 [Open Issues](https://github.com/Kavlin-Kaur/Happy-Trails/issues)
- 💬 [Discussions](https://github.com/Kavlin-Kaur/Happy-Trails/discussions)
- 🐛 [Report a Bug](https://github.com/Kavlin-Kaur/Happy-Trails/issues/new)
