var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/lib/AppSettings.ts
function loadSettings(filename) {
  return transformSettings(__require(filename).default);
}
__name(loadSettings, "loadSettings");
function loadLogTarget(settings) {
  if (!Array.isArray(settings.log_target)) {
    settings.log_target = [settings.log_target];
  }
  settings.log_target = settings.log_target.map((target) => target.toLowerCase()).filter((target) => ["console", "file"].includes(target));
  return settings;
}
__name(loadLogTarget, "loadLogTarget");
var isString = /* @__PURE__ */ __name((value) => typeof value === "string", "isString");
var isUndefined = /* @__PURE__ */ __name((value) => typeof value === "undefined", "isUndefined");
var getEnvVar = /* @__PURE__ */ __name((settings, key) => process.env[settings[key].slice(1)], "getEnvVar");
var setDefaultValue = /* @__PURE__ */ __name((settings, key, value) => isUndefined(settings[key]) && (settings[key] = value), "setDefaultValue");
function transformSettings(settings) {
  Object.keys(settings).filter((key) => isString(settings[key]) && !!getEnvVar(settings, key)).forEach((key) => settings[key] = getEnvVar(settings, key));
  setDefaultValue(settings, "dry_run", false);
  setDefaultValue(settings, "auto_merge_pull_requests", false);
  settings.use_forks = settings.use_pull_requests ? settings.use_forks : false;
  return loadLogTarget(settings);
}
__name(transformSettings, "transformSettings");

// src/types/BoostHistory.ts
var BoostHistoryItemState = /* @__PURE__ */ ((BoostHistoryItemState2) => {
  BoostHistoryItemState2["SUCCEEDED"] = "succeeded";
  BoostHistoryItemState2["FAILED"] = "failed";
  BoostHistoryItemState2["RUNNING"] = "running";
  BoostHistoryItemState2["SKIPPED"] = "skipped";
  BoostHistoryItemState2["UNKNOWN"] = "unknown";
  return BoostHistoryItemState2;
})(BoostHistoryItemState || {});

// src/lib/helpers.ts
import { lstatSync } from "fs";
import { customAlphabet } from "nanoid";
import semver from "semver";
var versionToShortVersion = /* @__PURE__ */ __name((version) => {
  const sv = semver.coerce(version);
  return `${sv.major}.${sv.minor}`;
}, "versionToShortVersion");
var generateRunId = /* @__PURE__ */ __name(() => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const func = customAlphabet(alphabet + numbers, 14);
  return func(14);
}, "generateRunId");
function lstatSafe(filename) {
  const result = lstatSync(filename, { throwIfNoEntry: false }) || null;
  return result;
}
__name(lstatSafe, "lstatSafe");

// src/lib/Tools.ts
import { execSync } from "child_process";
import { createHash } from "crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import yaml from "js-yaml";
import { dirname } from "path";
var Tools = class {
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  fileexists(path) {
    return existsSync(path);
  }
  readfile(path) {
    return readFileSync(path, { encoding: "utf8" });
  }
  writefile(path, content) {
    writeFileSync(path, content, { encoding: "utf8" });
  }
  copyfile(src, dest) {
    if (!existsSync(dirname(dest))) {
      mkdirSync(dirname(dest), { recursive: true });
    }
    copyFileSync(src, dest);
    return dest;
  }
  hashfile(path) {
    return this.hashstring(this.readfile(path));
  }
  hashstring(str) {
    return createHash("sha256").update(str).digest("hex").toLowerCase();
  }
  filesAreEqual(file1, file2) {
    if (!this.fileexists(file1) || !this.fileexists(file2)) {
      return false;
    }
    return this.hashfile(file1) === this.hashfile(file2);
  }
  readYaml(path) {
    return yaml.load(this.readfile(path));
  }
  writeYaml(path, data) {
    this.writefile(path, yaml.dump(data));
  }
  readJson(path) {
    return JSON.parse(this.readfile(path));
  }
  writeJson(path, data) {
    this.writefile(path, JSON.stringify(data, null, 4));
  }
  exec(command, silent = true) {
    return execSync(command, { stdio: silent ? "pipe" : "inherit" }).toString();
  }
  recursiveDirectoryCopy(src, dest, onCopiedCallback = null) {
    const files = [];
    const handler = /* @__PURE__ */ __name((src2, dest2) => {
      readdirSync(src2).forEach((file) => {
        const srcFn = src2 + "/" + file;
        const destFn = dest2 + "/" + file;
        const stats = lstatSafe(srcFn);
        this.handleFilesForDirectoryCopy({
          stats,
          srcFn,
          destFn,
          files: new Proxy(files, {}),
          onCopiedCallback
        });
        this.handleDirectoriesForDirectoryCopy({
          stats,
          srcFn,
          destFn,
          handler
        });
      });
    }, "handler");
    handler(src, dest);
    return files;
  }
  handleDirectoriesForDirectoryCopy({
    stats,
    srcFn,
    destFn,
    handler
  }) {
    if (!(stats == null ? void 0 : stats.isDirectory())) {
      return;
    }
    if (!this.fileexists(destFn)) {
      mkdirSync(destFn, { recursive: true });
    }
    handler(srcFn, destFn);
  }
  handleFilesForDirectoryCopy({
    stats,
    srcFn,
    destFn,
    files,
    onCopiedCallback
  }) {
    if (!(stats == null ? void 0 : stats.isFile()) || this.filesAreEqual(srcFn, destFn)) {
      return;
    }
    files.push(this.copyfile(srcFn, destFn));
    if (onCopiedCallback) {
      onCopiedCallback(srcFn, destFn);
    }
  }
};
__name(Tools, "Tools");

// src/lib/consts.ts
var APP_VERSION = "1.0.0";

// src/lib/github.ts
import { Octokit } from "@octokit/core/dist-node/index";
import { throttling } from "@octokit/plugin-throttling";
var AppOctokitDefaults;
function initOctokit(token) {
  AppOctokitDefaults = Octokit.defaults({
    auth: token,
    log: console,
    userAgent: `codeboost/v${APP_VERSION}`
  });
  AppOctokitDefaults.plugin(throttling);
}
__name(initOctokit, "initOctokit");
function createOctokit() {
  const result = new AppOctokitDefaults({
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        result.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
        if (retryCount < 2) {
          result.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        result.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
      }
    }
  });
  return result;
}
__name(createOctokit, "createOctokit");
var _Github = class {
  static async setCache(cache) {
    _Github.cache = cache;
  }
  static async currentUser(octokit = null) {
    octokit = octokit != null ? octokit : createOctokit();
    if (_Github.cache.currentUser) {
      return _Github.cache.currentUser;
    }
    const user = await octokit.request("GET /user");
    if (user.status !== 200) {
      throw new Error("Failed to get currently authenticated user");
    }
    _Github.cache.currentUser = { login: user.data.login };
    return user.data;
  }
  static async forkRepository(repository, octokit = null) {
    octokit = octokit != null ? octokit : createOctokit();
    const currentUserLogin = (await _Github.currentUser(octokit)).login;
    if (currentUserLogin === repository.owner) {
      throw new Error(`Cannot fork repository ${repository.owner}/${repository.name} into itself`);
    }
    const result = await octokit.request(`POST /repos/${repository.owner}/${repository.name}/forks`, {
      owner: currentUserLogin,
      repo: this.name,
      default_branch_only: true
    });
    if (result.status !== 202) {
      throw new Error(`Failed to create fork of ${repository.owner}/${repository.name}`);
    }
    return result.data;
  }
  static async getRepository(repository, octokit = null) {
    octokit = octokit != null ? octokit : createOctokit();
    const result = await octokit.request(`GET /repos/${repository.owner}/${repository.name}`);
    if (result.status !== 200) {
      throw new Error(`Failed to get repository ${repository.owner}/${repository.name}`);
    }
    return result.data;
  }
  static async createPullRequest(repository, branchName, defaultBranchName, title, body, octokit = null) {
    octokit = octokit != null ? octokit : createOctokit();
    const currentUsername = (await _Github.currentUser(octokit)).login;
    const result = await octokit.request(`POST /repos/${repository.owner}/${repository.name}/pulls`, {
      owner: currentUsername,
      repo: repository.name,
      title,
      body,
      head: `${currentUsername}:${branchName}`,
      base: defaultBranchName
    });
    if (result.status !== 201) {
      throw new Error(`Failed to create pull request for ${currentUsername}/${repository.name}`);
    }
    return result.data;
  }
  static async mergePullRequest(repository, pullRequestNumber, octokit = null) {
    octokit = octokit != null ? octokit : createOctokit();
    const result = await octokit.request(`PUT /repos/${repository.owner}/${repository.name}/pulls/${pullRequestNumber}/merge`, {
      owner: repository.owner,
      repo: repository.name,
      pull_number: pullRequestNumber,
      merge_method: "merge"
    });
    if (result.status !== 200) {
      throw new Error(`Failed to merge pull request for ${repository.owner}/${repository.name}`);
    }
    return result.data;
  }
};
var Github = _Github;
__name(Github, "Github");
__publicField(Github, "cache", { currentUser: null });

// src/lib/EventBus.ts
import EventEmitter2 from "eventemitter2";
var EventBus = class {
  constructor() {
    __publicField(this, "emitter");
    this.emitter = new EventEmitter2();
  }
  on(event, listener) {
    return this.emitter.on(event, listener);
  }
  off(event, listener) {
    return this.emitter.off(event, listener);
  }
  emit(event, ...args) {
    return this.emitter.emit(event, ...args);
  }
  once(event, listener) {
    return this.emitter.once(event, listener);
  }
};
__name(EventBus, "EventBus");
var eventbus = new EventBus();

// src/lib/Events.ts
var GIT_FILE_ADDED_EVENT = "git-file-added";

// src/lib/Boost.ts
import edge from "edge.js";
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "fs";
import semver2 from "semver";
import dayjs from "dayjs";
var Boost = class {
  constructor(codeBoost, boostPath) {
    __publicField(this, "codeBoost");
    __publicField(this, "repository", null);
    __publicField(this, "config");
    __publicField(this, "path");
    __publicField(this, "id");
    __publicField(this, "version");
    __publicField(this, "repositoryLimits");
    __publicField(this, "pullRequest");
    __publicField(this, "scripts");
    __publicField(this, "actions");
    __publicField(this, "state", {});
    __publicField(this, "changedFiles", []);
    __publicField(this, "runId");
    this.runId = generateRunId();
    this.config = this.loadConfiguration(boostPath);
    this.codeBoost = codeBoost;
    this.init(boostPath);
  }
  init(boostPath) {
    this.path = `${boostPath}/${this.config.version}`;
    this.id = this.config.id;
    this.version = this.config.version;
    this.repositoryLimits = {
      maxRunsPerVersion: this.config.repository_limits.max_runs_per_version,
      minutesBetweenRuns: this.config.repository_limits.minutes_between_runs
    };
    this.pullRequest = this.loadPullRequest(this.config.pull_request);
    this.scripts = this.loadScripts(this.config.scripts.files);
  }
  get appSettings() {
    return this.codeBoost.appSettings;
  }
  get history() {
    return this.codeBoost.historyManager.for(this.id);
  }
  log(message) {
    var _a;
    this.codeBoost.log(message, [{ boost: this.id, run_id: this.runId, repository: (_a = this.repository) == null ? void 0 : _a.fullRepositoryName() }]);
  }
  loadConfiguration(boostPath) {
    const config = __require(`${boostPath}/boost.js`).default;
    return config;
  }
  loadPullRequest(pullRequest) {
    return {
      title: pullRequest.title,
      body: pullRequest.body,
      branch: `${pullRequest.branch}-v${versionToShortVersion(this.version)}`
    };
  }
  loadScripts(scripts) {
    const result = [];
    for (const script of scripts) {
      const fn = `${this.path}/${script}`;
      if (!existsSync2(fn)) {
        throw new Error(`Boost script not found: ${fn}`);
      }
      result.push(__require(fn).handler);
    }
    return result;
  }
  async run(repository, args = []) {
    this.repository = repository;
    this.repository.initGitListeners(this.runId);
    const listener = eventbus.on(GIT_FILE_ADDED_EVENT, ({ repository: repository2, files, runId }) => {
      var _a;
      if (runId !== this.runId || ((_a = this.repository) == null ? void 0 : _a.fullRepositoryName()) !== `${repository2.owner}/${repository2.name}`) {
        return;
      }
      this.changedFiles.push(...files);
    });
    const historyItem = this.codeBoost.historyManager.createEntry({
      run_id: this.runId,
      boost: this.id,
      version: this.version,
      repository: repository.fullRepositoryName(),
      started_at: new Date().toISOString(),
      finished_at: null,
      state: "running" /* RUNNING */,
      pull_request: null
    });
    if (!this.canRunOnRepository(repository)) {
      historyItem.state = "skipped" /* SKIPPED */;
      historyItem.finished_at = new Date().toISOString();
      this.log(`Cannot run on ${repository.fullRepositoryName()}`);
      this.log("Done.");
      return false;
    }
    const params = await this.createScriptHandlerParameters(args, historyItem);
    const catchErrors = /* @__PURE__ */ __name(async (callBack, args2 = []) => {
      try {
        return await await callBack(...args2);
      } catch (e) {
        hasError = true;
        this.log(e);
        return false;
      }
    }, "catchErrors");
    const handleDryRun = /* @__PURE__ */ __name(async (callback, dryRunMessage) => {
      if (!this.appSettings.dry_run) {
        return await callback();
      }
      this.log(`[dry run] ${dryRunMessage}`);
      return null;
    }, "handleDryRun");
    let hasError = false;
    if (!this.appSettings.use_pull_requests) {
      this.pullRequest.branch = await repository.defaultBranch();
    }
    if (this.appSettings.use_pull_requests) {
      await this.updatePullRequestBranchName();
      await this.checkoutPullRequestBranch();
    }
    await catchErrors(async () => {
      await this.runInitializationScript(params);
      await this.runScripts(params);
    });
    if (!hasError && this.changedFiles.length > 0) {
      await catchErrors(async () => {
        const remote = this.appSettings.use_forks ? "fork" : "origin";
        await handleDryRun(
          async () => await repository.git.push(remote, this.pullRequest.branch),
          `push branch ${this.pullRequest.branch} to ${remote}`
        );
      });
      await catchErrors(async () => {
        handleDryRun(async () => {
          await this.handlePullRequestCreation({ repository, historyItem });
        }, "create pull request");
      });
    }
    historyItem.finished_at = new Date().toISOString();
    historyItem.state = hasError ? "failed" /* FAILED */ : "succeeded" /* SUCCEEDED */;
    listener.off(GIT_FILE_ADDED_EVENT, () => {
    });
  }
  async handlePullRequestCreation({ repository, historyItem }) {
    var _a, _b;
    if (!this.appSettings.use_pull_requests) {
      return;
    }
    const loadStringOrFile = /* @__PURE__ */ __name((value) => {
      return existsSync2(`${this.path}/${value}`) ? readFileSync2(`${this.path}/${value}`, "utf8") : value;
    }, "loadStringOrFile");
    const title = await edge.renderRaw(loadStringOrFile(this.pullRequest.title), { boost: this, state: () => this.state });
    const body = await edge.renderRaw(loadStringOrFile(this.pullRequest.body), { boost: this, state: () => this.state });
    const defaultBranch = (_b = await ((_a = this.repository) == null ? void 0 : _a.defaultBranch())) != null ? _b : "main";
    const pr = await Github.createPullRequest(repository, this.pullRequest.branch, defaultBranch, title.trim(), body.trim());
    historyItem.pull_request = pr == null ? void 0 : pr.number;
    if (pr) {
      this.log(`created pull request #${pr.number}`);
      if (this.appSettings.auto_merge_pull_requests) {
        await Github.mergePullRequest(repository, pr.number);
        this.log(`merged pull request #${pr.number}`);
      }
    }
  }
  async createScriptHandlerParameters(args, historyItem) {
    var _a;
    return {
      args,
      boost: this,
      currentRun: Object.freeze(Object.assign({}, historyItem)),
      git: (_a = this.repository) == null ? void 0 : _a.git,
      libs: {
        fs: __require("fs"),
        path: __require("path"),
        semver: semver2
      },
      repository: this.repository,
      tools: new Tools()
    };
  }
  async runInitializationScript(params) {
    if (existsSync2(`${this.path}/init.js`)) {
      const initFn = __require(`${this.path}/init.js`).handler;
      await initFn(params);
    }
  }
  async checkoutPullRequestBranch() {
    var _a;
    await ((_a = this.repository) == null ? void 0 : _a.checkout(this.pullRequest.branch));
  }
  async updatePullRequestBranchName() {
    if (!this.repository) {
      return false;
    }
    const branches = await this.repository.localBranches();
    if (branches.all.includes(this.pullRequest.branch)) {
      let counter = 1;
      let newBranchName = this.pullRequest.branch;
      while (branches.all.includes(newBranchName)) {
        counter++;
        newBranchName = `${this.pullRequest.branch}-${counter}`;
      }
      this.pullRequest.branch = newBranchName;
    }
    return true;
  }
  async runScripts(params) {
    if (this.config.scripts.parallel) {
      await Promise.allSettled(this.scripts.map((script) => script(params)));
      return;
    }
    for (const script of this.scripts) {
      await script(params);
    }
  }
  canRunOnRepository(repo) {
    const repoName = typeof repo === "string" ? repo : repo.fullRepositoryName();
    const runs = this.history.filter((run) => run.repository === repoName).filter((run) => run.version === this.version && run.run_id !== this.runId).filter((run) => run.state !== "skipped" /* SKIPPED */);
    if (this.repositoryLimits.maxRunsPerVersion <= runs.length) {
      return false;
    }
    return !this.isRunTimeRestricted(runs);
  }
  isRunTimeRestricted(runs) {
    for (const item of runs) {
      const runDate = dayjs(item.started_at);
      if (dayjs().diff(runDate, "minute") < this.repositoryLimits.minutesBetweenRuns) {
        return true;
      }
    }
    return false;
  }
};
__name(Boost, "Boost");

// src/traits/HasLogger.ts
import dayjs2 from "dayjs";
import merge from "deepmerge";
import winston from "winston";
var HasLogger = class {
  constructor() {
    __publicField(this, "logger");
  }
  createLogger(targets, defaultMeta) {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta,
      transports: []
    });
    if (targets.includes("file")) {
      new winston.transports.File({ filename: `${__dirname}/codeboost.log` });
    }
    this.logger.add(new winston.transports.Console({ format: winston.format.simple() }));
  }
  log(message, meta = []) {
    if (!this.logger || this.logger.transports.length === 0) {
      return;
    }
    this.logger.info(message, ...[merge.all([{ _ts: dayjs2().toISOString() }, ...meta])]);
  }
};
__name(HasLogger, "HasLogger");

// src/lib/CodeBoost.ts
import { Mixin } from "ts-mixer";
var CodeBoost2 = class extends Mixin(HasLogger) {
  constructor(appSettings, historyManager) {
    var _a;
    super();
    __publicField(this, "repository");
    __publicField(this, "appSettings");
    __publicField(this, "historyManager");
    __publicField(this, "repositoryPrepared", false);
    this.createLogger((_a = appSettings == null ? void 0 : appSettings.log_target) != null ? _a : [], {});
    this.appSettings = appSettings;
    this.historyManager = historyManager;
  }
  async init(repository, appSettings) {
    this.appSettings = appSettings;
    this.repository = repository;
  }
  async prepareRepository() {
    var _a, _b, _c;
    if (this.repositoryPrepared) {
      return;
    }
    await ((_a = this.repository) == null ? void 0 : _a.clone());
    await ((_b = this.repository) == null ? void 0 : _b.prepare());
    if (this.appSettings.use_forks && !this.appSettings.dry_run) {
      console.log("creating fork");
      await ((_c = this.repository) == null ? void 0 : _c.createFork());
    }
    this.repositoryPrepared = true;
  }
  async runBoost(boost, args) {
    boost = typeof boost === "string" ? this.getBoost(boost) : boost;
    await boost.run(this.repository, args);
    this.log("Done.");
    return boost;
  }
  getBoost(boostName) {
    return new Boost(this, `${this.appSettings.boosts_path}/${boostName}`);
  }
};
__name(CodeBoost2, "CodeBoost");

// src/lib/HistoryManager.ts
import { existsSync as existsSync3, readFileSync as readFileSync3, writeFileSync as writeFileSync2 } from "fs";
var HistoryManager2 = class {
  constructor(filename) {
    this.filename = filename;
    __publicField(this, "data", []);
    this.load();
  }
  for(boostName) {
    return this.data.filter((item) => item.boost === boostName);
  }
  createEntry(item) {
    this.data.push(item);
    return new Proxy(this.data[this.data.length - 1], {});
  }
  save() {
    if (this.filename.length === 0) {
      return;
    }
    writeFileSync2(this.filename, JSON.stringify(this.data), { encoding: "utf8" });
  }
  load() {
    if (this.filename.length === 0) {
      return;
    }
    if (!existsSync3(this.filename)) {
      this.save();
    }
    this.data = JSON.parse(readFileSync3(this.filename, { encoding: "utf8" }));
  }
};
__name(HistoryManager2, "HistoryManager");

// src/lib/stringHelpers.ts
function parseFullRepositoryName(fullRepositoryName) {
  if (!fullRepositoryName.includes("/")) {
    throw new Error(`Invalid repository name (missing "/")`);
  }
  const parts = fullRepositoryName.split("/");
  return {
    owner: parts[0],
    name: parts[1]
  };
}
__name(parseFullRepositoryName, "parseFullRepositoryName");

// src/lib/Repository.ts
import { execSync as execSync2 } from "child_process";
import { existsSync as existsSync4, mkdirSync as mkdirSync2 } from "fs";
import { dirname as dirname2 } from "path";
import simpleGit2 from "simple-git";
var Repository3 = class {
  constructor(fullRepositoryName, repositoryStoragePath) {
    __publicField(this, "name");
    __publicField(this, "owner");
    __publicField(this, "path");
    __publicField(this, "gitInstance");
    const { owner, name } = parseFullRepositoryName(fullRepositoryName);
    this.name = name;
    this.owner = owner;
    this.path = `${repositoryStoragePath}/${fullRepositoryName}`;
  }
  get info() {
    return {
      owner: this.owner,
      name: this.name
    };
  }
  get git() {
    if (this.gitInstance === void 0) {
      this.gitInstance = simpleGit2({
        baseDir: this.path,
        binary: "git",
        maxConcurrentProcesses: 3,
        trimmed: false
      });
    }
    return this.gitInstance;
  }
  initGitListeners(runId) {
    this.git.add = (files, callback) => {
      eventbus.emit(GIT_FILE_ADDED_EVENT, { repository: this.info, files, runId });
      return this.gitInstance.raw(["add", ...[].concat(files)], callback);
    };
  }
  async clone() {
    const parentDir = dirname2(this.path);
    if (!existsSync4(parentDir)) {
      mkdirSync2(parentDir, { recursive: true });
    }
    if (!existsSync4(this.path)) {
      execSync2(`git -C '${parentDir}' clone git@github.com:${this.owner}/${this.name}.git`, { stdio: "pipe" });
    }
    return true;
  }
  async prepare() {
    try {
      await this.checkout(await this.defaultBranch());
      await this.git.pull("origin");
    } catch (e) {
      console.log("Error preparing repository: ", e);
    }
  }
  async localBranches() {
    const result = await this.git.branchLocal();
    return result;
  }
  async currentBranch() {
    return (await this.localBranches()).current;
  }
  async onBranch(branchName) {
    return await this.currentBranch() === branchName;
  }
  async checkout(branchName) {
    const branchList = await this.localBranches();
    if (branchList.current === branchName) {
      return;
    }
    if (branchList.all.includes(branchName)) {
      await this.git.checkout(branchName);
      return;
    }
    await this.git.checkoutLocalBranch(branchName);
  }
  async defaultBranch() {
    const result = await this.git.revparse("--abbrev-ref", ["origin/HEAD"]);
    return result.replace(/^.+\//, "");
  }
  async createFork() {
    const octokit = createOctokit();
    try {
      const result = await Github.forkRepository(this.info, octokit);
      this.git.addRemote("fork", result.ssh_url);
      return;
    } catch (e) {
      console.error(e);
    }
    try {
      const result = await Github.getRepository(this.info, octokit);
      this.git.addRemote("fork", result.ssh_url);
    } catch (e) {
      console.error(e);
    }
  }
  async pushToFork(branchName) {
    await this.git.push("fork", branchName);
  }
  fullRepositoryName() {
    return `${this.owner}/${this.name}`;
  }
};
__name(Repository3, "Repository");
export {
  Boost,
  BoostHistoryItemState,
  CodeBoost2 as CodeBoost,
  Github,
  HasLogger,
  HistoryManager2 as HistoryManager,
  Repository3 as Repository,
  Tools,
  createOctokit,
  initOctokit,
  loadSettings,
  transformSettings
};
