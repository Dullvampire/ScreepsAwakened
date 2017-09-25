module.exports = function () {
    Room.prototype.initManager = function () {
        if (this.memory.init == true) {
            return;
        }

        this.memory.spawnQueue = [];
        this.memory.jobs = {};

        this.memory.init = true;
    };

    Room.prototype.queueCreep =  function (priority, body, name, mem, job) {
        if (!name) {
            name = '';
        }
        if (!mem) {
            mem = {};
        }
        if (!job) {
            job = null;
        }

        if (job != null) {
            mem.job = job;
        }

        this.memory.spawnQueue.push({
            priority: priority,
            body: body,
            name: name,
            memory: mem,
            job: job,
            spawning: false,
            cost: calculateBodyCost(body)
        });

        this.memory.spawnQueue = _.sortBy(this.memory.spawnQueue, ['priority']);
    };

    Room.prototype.addJob = function (name, jobName, params) {
        if (this.memory.jobs[name]) {
            console.log('Name: ' + name + ' is already a job');
            return false;
        }

        this.memory.jobs[name] = {
            name: name,
            jobName: jobName,
            params: params,
            creepId: null
        };

        return true;
    };

    Room.prototype.deleteJob = function (jobName) {
        if (this.memory.jobs[jobName]) {
            delete this.memory.jobs[jobName];
        }
    };

    Room.prototype.tick = function () {
        if (!this.memory.init) {
            this.initManager();
        }

        //First attempt to spawn a new creep
        for (var spawn of _.sortBy(function (spawn) {
            return spawn.energyAvailable;
        }, this.find(FIND_MY_STRUCTURES, {filter: function (s) {
            return s.structureType == STRUCTURE_SPAWN && !s.spawning;
        }}))) {
            for (var spawnOrderIndex in this.memory.spawnQueue) {
                var spawnOrder = this.memory.spawnQueue[spawnOrderIndex];
                if (spawn.energyAvailable >= spawnOrder.cost) {
                    var response = spawn.createCreep(spawnOrder.body, spawnOrder.name, spawnOrder.memory);
                    if (typeof(respose) == 'string') {
                        this.memory.spawnQueue[spawnOrderIndex].spawning = true;
                    } else {
                        console.log('error spawning ' + JSON.stringify(spawnOrder) + ' yielding error response');
                    }
                }
            }
        }

        for (var spawnOrderIndex in this.memory.spawnOrder) {
            var spawnOrder = this.memory.spawnQueue[spawnOrderIndex];
            if (spawnOrder.spawning && Game.creeps[spawnOrder.name]) {
                this.memory.spawnOrder.shift();
            }
        }

        //Now manage creep jobs
        for (var job in this.memory.jobs) {
            if (!Game.getObjectById(this.memory.jobs[job].creepId) || !_.find(this.spawnQueue, function (order) { return order.job == job; })) {
                this.memory.jobs[job].creepId = null;
            }
        }
    };

    Object.defineProperty(Room.prototype, 'energyInExtensions', {
        get: function () {
            return _.sum(_.map(function (e) {
                return e.energy;
            }, this.find(FIND_MY_STRUCTURES, {filter: function (s) {
                return s.structureType == STRUCTURE_EXTENSION;
            }})));
        }
    });
};
