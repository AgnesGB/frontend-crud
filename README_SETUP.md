# Environment Setup

## Prerequisites
Make sure you have installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Python (version 3.7 or higher)

## Windows

### PowerShell Execution Policy Fix
If you get a "scripts is disabled" error, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Setup Options

**Option 1: Using batch script (Recommended)**
1. Run the setup script:
   ```cmd
   setup_venv.bat
   ```

2. Activate the virtual environment:
   ```cmd
   venv\Scripts\activate.bat
   ```

**Option 2: Using PowerShell**
1. Create and activate:
   ```powershell
   python -m venv venv
   venv\Scripts\Activate.ps1
   ```

**Option 3: Using Command Prompt**
1. Create and activate:
   ```cmd
   python -m venv venv
   venv\Scripts\activate.bat
   ```

## Linux/Mac
1. Make the script executable and run it:
   ```bash
   chmod +x setup_venv.sh
   ./setup_venv.sh
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

## Manual Setup
If the scripts don't work, you can set up manually:

1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate it:
   - Windows: `venv\Scripts\activate.bat`
   - Linux/Mac: `source venv/bin/activate`

3. Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```

4. Install project dependencies:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

5. Verify Angular installation:
   ```bash
   ng version
   ```

## Running the Project

### Start Angular Development Server
```bash
ng serve
```

### Alternative npm commands
If `ng serve` doesn't work, try:
```bash
npm start
npm run serve
npx ng serve
```

## Deactivating
To deactivate the virtual environment, simply run:
```bash
deactivate
```

## Troubleshooting

### Angular CLI Issues
- Install Angular CLI globally: `npm install -g @angular/cli`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Use npx: `npx ng serve` instead of `ng serve`

### npm Installation Issues
- Check Node.js version: `node --version` (should be 14+)
- Update npm: `npm install -g npm@latest`
- Clear cache: `npm cache clean --force`
- Delete package-lock.json and node_modules, then `npm install`

### Windows PowerShell Issues
- Use `venv\Scripts\activate.bat` instead of `venv\Scripts\Activate.ps1`
- Or fix execution policy as shown above
- Or use Command Prompt instead of PowerShell

### Permission Issues
- Run terminal as Administrator (Windows)
- Use `sudo` if needed (Linux/Mac)
