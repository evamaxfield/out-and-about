# Contributing

Contributions are welcome, and they are greatly appreciated! Every little bit
helps, and credit will always be given.

## Get Started!

Ready to contribute? Here's how to set up `JacksonMaxfield/out-and-about` for local
development.

1. Fork the `JacksonMaxfield/out-and-about` repo on GitHub.

2. Clone your fork locally:

   ```bash
   git clone git@github.com:{your_name_here}/out-and-about.git
   ```

3. Add upstream remote:

   ```bash
   cd out-and-about/
   git remote add upstream https://github.com/JacksonMaxfield/out-and-about.git
   git fetch upstream master
   ```

4. Install the project.

   ```bash
   npm i
   ```

5. Create a branch for local development:

   ```bash
   git checkout -b {your_development_type}/short-description
   ```

   Ex: feature/add-restrooms-list
   Now you can make your changes locally.

6. To view your changes as you make them run:

   ```bash
   npm run start
   ```

7. When you're done making changes, format your code:

   ```bash
   npm run format
   ```

8. Commit your changes and push your branch to GitHub.

   ```bash
   git add .
   git commit -m "Your detailed description of your changes."
   ```

   If there are new commits from upstream's master since your last git pull, you need to merge the latest commits from upstream's master into your branch and resolve any merge conflicts locally. If there are no new commits from upstream's master, you can skip step a, b, and c.

   a. Get the latest commits:

   ```bash
   git checkout master
   git pull --rebase upstream master
   ```

   b. Merge the latest commits into your branch:

   ```bash
   git checkout {your_development_type}/short-description

   git rebase master
   or
   git merge master
   ```

   c. Resolve any merge conflicts and if needed check that your changes pass linting and tests.

   Push your branch to GitHub:

   ```bash
   git push origin {your_development_type}/short-description
   ```

9. Submit a pull request through the GitHub website.

10. Once your branch has been merged to master, if you want to keep your fork and local repo clean, you can delete your branch.

    ```bash
    git push origin --delete {your_development_type}/short-description
    git branch -D {your_development_type}/short-description
    ```

    Keep your local and fork repo's master up-to-date with upstream's master:

    ```bash
    git checkout master
    git pull --rebase upstream master
    git push origin master
    ```

## Deploying

Once your branch has been merged to master, GitHub will automatically deploy your changes to the live website.
