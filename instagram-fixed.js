// Fixed Instagram module for hello.js
// This addresses the Instagram Basic Display API requirements

(function(hello) {
    
    hello.init({
        
        instagram: {
            
            name: 'Instagram',
            
            oauth: {
                // Updated to use Instagram Basic Display API
                version: 2,
                auth: 'https://api.instagram.com/oauth/authorize',
                grant: 'https://api.instagram.com/oauth/access_token'
            },
            
            // Refresh the access_token once expired
            refresh: true,
            
            scope: {
                basic: 'user_profile,user_media',
                photos: 'user_media',
                email: '', // Not available in Basic Display API
                publish: '', // Not available in Basic Display API
                share: '',
                publish_files: '',
                files: '',
                videos: '',
                offline_access: ''
            },
            
            scope_delim: ',', // Instagram uses comma-separated scopes
            
            base: 'https://graph.instagram.com/',
            
            get: {
                me: 'me?fields=id,username,account_type,media_count',
                'me/photos': 'me/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp',
                'me/media': 'me/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp'
            },
            
            wrap: {
                me: function(o) {
                    if (o.error) {
                        return o;
                    }
                    
                    // Format response to match hello.js expected format
                    if (o.id) {
                        o.name = o.username;
                        o.thumbnail = o.profile_picture_url || '';
                    }
                    
                    return o;
                },
                
                'me/photos': function(o) {
                    if (o.error) {
                        return o;
                    }
                    
                    if (o.data) {
                        o.data = o.data.filter(function(item) {
                            return item.media_type === 'IMAGE';
                        }).map(function(item) {
                            return {
                                id: item.id,
                                name: item.caption || '',
                                picture: item.media_url,
                                thumbnail: item.thumbnail_url || item.media_url,
                                created_time: item.timestamp
                            };
                        });
                    }
                    
                    return o;
                },
                
                'me/media': function(o) {
                    if (o.error) {
                        return o;
                    }
                    
                    if (o.data) {
                        o.data = o.data.map(function(item) {
                            return {
                                id: item.id,
                                name: item.caption || '',
                                picture: item.media_url,
                                thumbnail: item.thumbnail_url || item.media_url,
                                created_time: item.timestamp,
                                type: item.media_type
                            };
                        });
                    }
                    
                    return o;
                },
                
                'default': function(o) {
                    return o;
                }
            },
            
            // Instagram Basic Display API supports CORS
            xhr: function(p, qs) {
                return false; // Use direct XHR, no proxy needed
            },
            
            // No form support
            form: false
        }
    });
    
})(hello);