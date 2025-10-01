import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Mail, Calendar, Users, Award } from 'lucide-react';
import { COMMUNITY_LEADERS } from '../data/communityLeaders';

const CommunityLeaderInfo = React.memo(() => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Community Leaders
        </h2>
        <p className="text-muted-foreground">
          Meet the dedicated leaders managing your community's waste management
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMMUNITY_LEADERS.map((leader, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                {leader.avatar ? (
                  <img
                    src={leader.avatar}
                    alt={leader.fullName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {leader.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{leader.fullName}</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Award className="w-3 h-3 mr-1" />
                Community Leader
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{leader.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined {new Date(leader.joinedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Managing community operations</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Want to become a Community Leader?
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 max-w-2xl mx-auto">
              Community Leaders help coordinate waste management efforts, organize community initiatives, 
              and ensure efficient service delivery. Contact us to learn about leadership opportunities.
            </p>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 inline-block">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                📧 Apply at: leadership@greengrid.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CommunityLeaderInfo.displayName = 'CommunityLeaderInfo';

export { CommunityLeaderInfo };
