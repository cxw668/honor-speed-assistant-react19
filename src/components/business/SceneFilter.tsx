import { Button } from '../atomic/Button';

interface SceneFilterProps {
  activeScene: string;
  onSceneChange: (scene: string) => void;
}

export const SceneFilter = ({ activeScene, onSceneChange }: SceneFilterProps) => {
  const scenes = ['常规', '顺风', '逆风'];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-desc text-sm font-bold ml-1">对局场景</label>
      <div className="flex gap-3 bg-bg-card p-1.5 rounded-2xl border-2 border-border-light">
        {scenes.map((scene) => (
          <Button
            key={scene}
            variant={activeScene === scene ? 'primary' : 'secondary'}
            onClick={() => onSceneChange(scene)}
            className="flex-1 !rounded-xl !py-2 shadow-none"
            size="sm"
          >
            {scene}
          </Button>
        ))}
      </div>
    </div>
  );
};
