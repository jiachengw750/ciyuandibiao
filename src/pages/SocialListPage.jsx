import { ArrowLeft, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReqBadge } from '../components/ReqAnnotation';

export default function SocialListPage() {
  const { routeStack, popRoute, socialProfiles, toggleFollowUser } = useApp();
  const currentRoute = routeStack[routeStack.length - 1];
  const type = currentRoute.params.type || 'followers';
  const isFollowers = type === 'followers';
  const rows = socialProfiles.filter(profile => isFollowers ? profile.isFollower : profile.isFollowing);

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col select-none relative">
      <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderBottom: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button onClick={popRoute} className="interactive-scale" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={16} className="text-neutral-600" />
        </button>
        <h1 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
          {isFollowers ? '粉丝列表' : '关注列表'}
          <ReqBadge id="MINE-SOCIAL" style={{ position: 'relative', top: '-1px' }} />
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.length > 0 ? (
          rows.map(profile => (
            <div key={profile.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', boxShadow: 'var(--m-shadow-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={profile.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>{profile.name}</span>
                  {profile.isFollower && profile.isFollowing && (
                    <span style={{ fontSize: '7px', fontWeight: 800, color: 'var(--m-primary)', backgroundColor: 'var(--m-primary-light)', borderRadius: '9999px', padding: '1px 5px' }}>互关</span>
                  )}
                </div>
                <p style={{ margin: '3px 0', fontSize: '8px', color: 'var(--m-text-sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.bio}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {profile.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '7px', color: 'var(--m-text-muted)', backgroundColor: '#F8F9FA', borderRadius: '9999px', padding: '1px 5px' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggleFollowUser(profile.id)}
                className="interactive-scale"
                style={{ border: 'none', borderRadius: '9999px', padding: '6px 10px', backgroundColor: profile.isFollowing ? 'var(--m-slate-light)' : 'var(--m-primary)', color: profile.isFollowing ? 'var(--m-text-sub)' : '#FFFFFF', fontSize: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}
              >
                {!profile.isFollowing && <UserPlus size={10} />}
                {profile.isFollowing ? '已关注' : '关注'}
              </button>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', color: 'var(--m-text-muted)', fontSize: '9px', fontWeight: 700 }}>
            {isFollowers ? '暂时还没有粉丝' : '暂时还没有关注任何同好'}
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 800 }}>
          已加载全部列表
        </div>
      </div>
    </div>
  );
}
