# Keeping Empty Directories in Git with gitkeep

**TL;DR** Git tracks files, not directories, so an empty folder never gets committed. `.gitkeep` is not a Git feature. It is a community created naming convention: A tiny placeholder file that gives Git something in the folder to hold onto.

Here is the whole trick:

```
some-new-empty-folder/
   .gitkeep
```

`some-new-empty-folder` on its own being empty will not be committed. Add one file inside it and Git now has something to track, so the directory shows up when someone clones the repo.

## The problem it solves

Sometimes your application expects a folder structure to exist. Some of the directories may be empty, but the code assumes they are there like `uploads`, `tmp`, `generated` etc. `.gitkeep` is how you ship the structure without any contents.

## It has no special meaning

This is the part people miss. This is just a naming convention, Git has never heard of `.gitkeep`. You could call the file anything and Git would behave the same. The secret sauce is not the name but a folder that is no longer empty.

## .gitkeep vs .gitignore

Do not confuse the two:

.gitkeep - An usually empty placeholder so an empty directory gets committed.

.gitignore - Tells Git which fiels should not be tracked

<ADD A VISUAL HERE>

Sometimes you want both ideas at once. Say you want a `logs/` directory to exist in the repo, but you do not want to commit the actual log files that land in it. Put a `.gitignore` inside the folder:

```
logs/
  .gitignore
```

With:

```
*
!.gitignore
```

That reads as: ignore everything in `logs/`, except the `.gitignore` file itself. The folder gets preserved, and the file also documents that the generated contents are meant to stay untracked. That is often cleaner that a bare `.gitkeep`, which preserves the folder but explains nothing.