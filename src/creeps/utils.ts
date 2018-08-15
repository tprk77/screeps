// Copyright (c) 2018 Tim Perkins

interface Task {
  run: (creep: Creep) => boolean;
}

export function runTasks(creep: Creep, tasks: (Task|null)[]) {
  _.some(tasks, (task) => task && task.run(creep));
}
