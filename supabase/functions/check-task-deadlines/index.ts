import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NOTIFICATION_THRESHOLD_HOURS = 24; // Notify when task is due within 24 hours

Deno.serve(async (req) => {
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + NOTIFICATION_THRESHOLD_HOURS * 60 * 60 * 1000);

    // Get tasks that are due soon
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to:profiles!tasks_assigned_to_fkey (
          id,
          first_name,
          last_name,
          email
        ),
        created_by:profiles!tasks_created_by_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .lt('due_date', thresholdDate.toISOString())
      .gt('due_date', now.toISOString())
      .neq('status', 'completed');

    if (tasksError) throw tasksError;

    for (const task of tasks || []) {
      // Create notification for assigned user
      if (task.assigned_to) {
        await supabase.from('notifications').insert({
          user_id: task.assigned_to.id,
          title: 'Task Due Soon',
          message: `Task "${task.title}" is due in less than ${NOTIFICATION_THRESHOLD_HOURS} hours`,
          type: 'task_deadline',
        });

        // Send email notification
        await resend.emails.send({
          from: 'Task Manager <onboarding@resend.dev>',
          to: task.assigned_to.email,
          subject: 'Task Due Soon',
          html: `
            <h1>Task Deadline Reminder</h1>
            <p>Hello ${task.assigned_to.first_name},</p>
            <p>This is a reminder that the task "${task.title}" is due in less than ${NOTIFICATION_THRESHOLD_HOURS} hours.</p>
            <p>Please make sure to complete it before the deadline.</p>
            <p>Best regards,<br>Task Manager Team</p>
          `,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});